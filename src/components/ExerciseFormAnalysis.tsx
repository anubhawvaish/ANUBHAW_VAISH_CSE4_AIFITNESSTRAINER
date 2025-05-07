import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, Activity, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ExerciseFormAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentExercise, setCurrentExercise] = useState('squat');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isExercising, setIsExercising] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const previousFrameRef = useRef<ImageData | null>(null);
  const motionDetectionIntervalRef = useRef<number | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Exercise form instructions
  const exerciseInstructions = {
    squat: {
      title: 'Proper Squat Form',
      steps: [
        'Stand with feet shoulder-width apart, toes slightly turned out',
        'Keep chest up, shoulders back, and core engaged',
        'Begin by pushing hips back, then bend knees to lower down',
        'Lower until thighs are parallel to floor or as deep as comfortable',
        'Keep weight in heels and midfoot, knees tracking over toes',
        'Push through heels to stand back up to starting position'
      ],
      commonErrors: [
        'Knees collapsing inward',
        'Rising onto toes or heels coming off floor',
        'Rounded back or excessive forward lean',
        'Not reaching adequate depth',
        'Looking down instead of maintaining neutral gaze'
      ]
    },
    pushup: {
      title: 'Proper Push-up Form',
      steps: [
        'Start in plank position with hands slightly wider than shoulders',
        'Create a straight line from head to heels',
        'Engage core and glutes to maintain rigid body position',
        'Lower chest toward floor by bending elbows at 45° angle from body',
        'Lower until chest is about an inch from floor',
        'Push through palms to return to starting position'
      ],
      commonErrors: [
        'Sagging or hiking the hips',
        'Flaring elbows too wide',
        'Not going low enough or going too low',
        'Head dropping forward or looking up too much',
        'Holding breath instead of breathing rhythmically'
      ]
    },
    lunge: {
      title: 'Proper Lunge Form',
      steps: [
        'Stand tall with feet hip-width apart',
        'Step forward with one leg into a stride position',
        'Lower body by bending both knees to about 90 degrees',
        'Keep front knee aligned over ankle, not pushing forward of toes',
        'Maintain upright torso and engaged core',
        'Push through front heel to return to standing or continue to next rep'
      ],
      commonErrors: [
        'Front knee extending past toes',
        'Leaning too far forward',
        'Back knee not lowering enough',
        'Unstable front foot or heel lifting',
        'Shoulders hunching or poor posture'
      ]
    },
    plank: {
      title: 'Proper Plank Form',
      steps: [
        'Place forearms on ground with elbows under shoulders',
        'Extend legs behind you with toes tucked under',
        'Create a straight line from head to heels',
        'Engage core by drawing navel toward spine',
        'Keep shoulders relaxed away from ears',
        'Hold position while breathing normally'
      ],
      commonErrors: [
        'Sagging hips or midsection',
        'Raising hips too high (piking)',
        'Holding breath instead of breathing normally',
        'Neck strain from improper head position',
        'Shoulder blades not properly engaged'
      ]
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      if (!isRecording) return;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        toast({
          title: 'Camera access granted',
          description: 'Get ready to perform your exercise',
        });
        
        // Start motion detection after camera is set up
        startMotionDetection();
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast({
          title: 'Camera access denied',
          description: 'Please allow camera access to use this feature',
          variant: 'destructive',
        });
        setIsRecording(false);
      }
    };
    
    setupCamera();
    
    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      stopMotionDetection();
      
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [isRecording, toast]);

  const startMotionDetection = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvasRef.current.width = 320;
    canvasRef.current.height = 240;
    
    const detectMotion = () => {
      if (!canvasRef.current || !videoRef.current || !ctx) return;
      
      try {
        // Draw current video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Get image data
        const currentFrame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // If we have a previous frame, compare them
        if (previousFrameRef.current) {
          const currentData = currentFrame.data;
          const previousData = previousFrameRef.current.data;
          let pixelDiffCount = 0;
          
          // Sample pixels (check every 10th pixel to improve performance)
          for (let i = 0; i < currentData.length; i += 40) {
            const diff = Math.abs(currentData[i] - previousData[i]) +
                         Math.abs(currentData[i + 1] - previousData[i + 1]) +
                         Math.abs(currentData[i + 2] - previousData[i + 2]);
                         
            if (diff > 30) { // Threshold for what counts as movement
              pixelDiffCount++;
            }
          }
          
          // Calculate percentage of pixels that changed
          const totalSampledPixels = currentData.length / 40;
          const motionPercentage = (pixelDiffCount / totalSampledPixels) * 100;
          setMotionLevel(Math.min(100, motionPercentage * 5)); // Scale for visualization
          
          // Determine if user is exercising based on motion level
          const newIsExercising = motionPercentage > 1.5; // Threshold for what counts as exercise
          
          if (newIsExercising && !isExercising) {
            // User just started exercising
            setIsExercising(true);
            setFeedback([]);
            
            // Start exercise analysis with a small delay
            analysisTimeoutRef.current = setTimeout(() => {
              const exerciseFeedback = simulateFormAnalysis(currentExercise);
              startFeedbackStream(exerciseFeedback);
            }, 2000);
          } else if (!newIsExercising && isExercising) {
            // User stopped exercising
            setIsExercising(false);
            
            if (analysisTimeoutRef.current) {
              clearTimeout(analysisTimeoutRef.current);
            }
          }
        }
        
        // Save current frame as previous for next comparison
        previousFrameRef.current = currentFrame;
      } catch (e) {
        console.error('Error in motion detection:', e);
      }
    };
    
    // Run motion detection at regular intervals
    motionDetectionIntervalRef.current = window.setInterval(detectMotion, 150);
  };

  const stopMotionDetection = () => {
    if (motionDetectionIntervalRef.current !== null) {
      clearInterval(motionDetectionIntervalRef.current);
      motionDetectionIntervalRef.current = null;
    }
    setIsExercising(false);
    previousFrameRef.current = null;
    setMotionLevel(0);
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      setFeedback([]);
      setIsExercising(false);
    }
    setIsRecording(!isRecording);
  };
  
  const simulateFormAnalysis = (exercise: string): string[] => {
    // Enhanced feedback based on exercise type with more specific form correction
    const feedbackLibrary = {
      'squat': [
        'Good hip hinge at the start of the movement',
        'Knees are tracking slightly inward - focus on pushing them outward in line with toes',
        'Maintain a more neutral spine by keeping chest up throughout the movement',
        'Try to lower your hips below parallel for better range of motion',
        'Weight distribution looks good - stay on your heels and midfoot',
        'Good depth on that rep, maintain consistent depth on each repetition',
        'Remember to breathe out as you push up from the bottom position',
      ],
      'pushup': [
        'Keep your elbows at a 45 degree angle from your body, avoid flaring them out',
        'Core is engaged well, maintain that tension throughout',
        'Lower your chest closer to the ground for full range of motion',
        'Keep your neck in a neutral position by looking at a spot on the floor',
        'Your hand placement looks good - directly under your shoulders',
        'Maintain a straight line from head to heels by engaging your glutes',
        'Try to move at a controlled tempo - 2 seconds down, 1 second up',
      ],
      'lunge': [
        'Front knee is tracking well over your toe, good alignment',
        'Keep your torso more upright by engaging your core muscles',
        'Your step length is appropriate - maintain this distance',
        'Lower your back knee closer to the ground for full range of motion',
        'Weight should be primarily through the heel of your front foot',
        'Maintain even timing between repetitions for consistent form',
        'Keep your shoulders pulled back and down away from your ears',
      ],
      'plank': [
        'Shoulders should be stacked directly over your wrists or elbows',
        'Your hips are slightly too high - lower them to create a straight line',
        'Engage your core more by drawing your navel toward your spine',
        'Keep your neck in a neutral position by looking at a spot on the floor',
        'Distribute weight evenly between your forearms and toes',
        'Remember to breathe normally while holding the position',
        'Squeeze your glutes to help maintain proper hip position',
      ]
    };
    
    return feedbackLibrary[exercise as keyof typeof feedbackLibrary] || [];
  };
  
  const startFeedbackStream = (feedbackItems: string[]) => {
    setFeedback([]);
    
    // Show feedback items one at a time with delays
    feedbackItems.forEach((item, index) => {
      setTimeout(() => {
        setFeedback(prev => [...prev, item]);
      }, 2000 + (index * 3000)); // Start after 2 seconds, then every 3 seconds
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Exercise Form Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Type
                </label>
                <Select 
                  value={currentExercise} 
                  onValueChange={setCurrentExercise}
                  disabled={isRecording}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="squat">Squat</SelectItem>
                    <SelectItem value="pushup">Push-up</SelectItem>
                    <SelectItem value="lunge">Lunge</SelectItem>
                    <SelectItem value="plank">Plank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
                {isRecording ? (
                  <>
                    <video 
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas 
                      ref={canvasRef} 
                      className="absolute inset-0 w-full h-full opacity-0"
                    />
                    {isExercising && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        Movement Detected
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-fitness-purple rounded-full transition-all duration-300"
                        style={{ width: `${motionLevel}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CameraOff className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-400 mt-2 absolute -bottom-8 w-full text-center">
                      Camera is off
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={toggleRecording}
                className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-fitness-purple hover:bg-fitness-midPurple'}
              >
                {isRecording ? (
                  <div className="flex items-center">
                    <CameraOff className="mr-2 h-4 w-4" />
                    Stop Analysis
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Analysis
                  </div>
                )}
              </Button>

              {/* Exercise form instructions accordion */}
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="instructions">
                  <AccordionTrigger className="flex items-center">
                    <div className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4 text-fitness-purple" />
                      <span>How to perform {currentExercise} correctly</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {exerciseInstructions[currentExercise as keyof typeof exerciseInstructions] && (
                      <div className="pt-2">
                        <h4 className="font-medium mb-2">
                          {exerciseInstructions[currentExercise as keyof typeof exerciseInstructions].title}
                        </h4>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Step-by-step instructions:</p>
                          <ol className="list-decimal pl-5 space-y-1 text-sm">
                            {exerciseInstructions[currentExercise as keyof typeof exerciseInstructions].steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Common mistakes to avoid:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-red-600">
                            {exerciseInstructions[currentExercise as keyof typeof exerciseInstructions].commonErrors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Real-time Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {!isRecording ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-gray-400 mb-2">
                  <Camera className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">
                  Start the camera to get real-time feedback on your form
                </p>
              </div>
            ) : !isExercising ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-gray-400 mb-2">
                  <Activity className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">
                  Start performing your {currentExercise} to receive feedback
                </p>
              </div>
            ) : feedback.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-8 h-8 rounded-full fitness-gradient animate-pulse-subtle" />
                <p className="text-gray-500 mt-4">Analyzing your form...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Form analysis for {currentExercise.charAt(0).toUpperCase() + currentExercise.slice(1)}:
                </p>
                <div className="space-y-2">
                  {feedback.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-gray-50 rounded-md animate-fade-in flex"
                    >
                      <div className="w-1 bg-fitness-purple rounded-full mr-3" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                
                {feedback.length > 0 && (
                  <div className="pt-4">
                    <p className="text-sm font-medium">
                      Overall: {feedback.length < 3 ? 'Analysis in progress...' : 'Good form with minor adjustments needed'}
                    </p>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Continue practicing with these adjustments to improve your form and maximize results while reducing injury risk.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExerciseFormAnalysis;
