import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { colleges, majors } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, GraduationCap } from "lucide-react";
import { Link } from "wouter";

export default function Guidance() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [gpa, setGpa] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { id: 'tech', label: 'Technology & Coding' },
    { id: 'health', label: 'Healthcare & Medicine' },
    { id: 'design', label: 'Design & Arts' },
    { id: 'business', label: 'Business & Management' },
    { id: 'engineering', label: 'Engineering & Construction' },
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Simple Mock Logic
  const recommendations = majors.filter(m => {
    if (m.gpa > gpa) return false;
    // Mock interest matching based on simple keywords
    if (selectedInterests.includes('tech') && m.name.includes('Software')) return true;
    if (selectedInterests.includes('health') && m.name.includes('Medicine')) return true;
    if (selectedInterests.includes('engineering') && m.name.includes('Engineering')) return true;
    if (selectedInterests.length === 0) return true; // Show all if no interest selected (fallback)
    return false;
  });

  return (
    <Layout>
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">{t('guidance')}</h1>
          <p className="opacity-90 max-w-2xl mx-auto">
            Answer a few questions and let our AI-powered system recommend the best academic path for you.
          </p>
        </div>
      </div>

      <div className="container py-12 max-w-3xl">
        <div className="flex justify-between mb-8 relative">
           <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -z-10 -translate-y-1/2" />
           {[1, 2, 3].map((s) => (
             <div 
               key={s} 
               className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}
             >
               {s}
             </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">What is your High School GPA?</h2>
                    <p className="text-muted-foreground">This helps us check your eligibility.</p>
                  </div>
                  <div className="max-w-xs mx-auto">
                    <Label>GPA (out of 5.0)</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.1" 
                      value={gpa} 
                      onChange={(e) => setGpa(parseFloat(e.target.value))} 
                      className="text-center text-2xl font-bold h-16 mt-2"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNext} disabled={gpa <= 0} size="lg">
                      Next Step <ArrowRight className="ml-2 h-4 w-4 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">What are you interested in?</h2>
                    <p className="text-muted-foreground">Select all that apply.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interests.map((interest) => (
                      <div 
                        key={interest.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedInterests.includes(interest.id) ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:bg-muted/80'}`}
                        onClick={() => {
                          if (selectedInterests.includes(interest.id)) {
                             setSelectedInterests(selectedInterests.filter(i => i !== interest.id));
                          } else {
                             setSelectedInterests([...selectedInterests, interest.id]);
                          }
                        }}
                      >
                         <div className="flex items-center gap-3">
                           <Checkbox checked={selectedInterests.includes(interest.id)} />
                           <span className="font-bold">{interest.label}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack} size="lg">
                      Back
                    </Button>
                    <Button onClick={handleNext} disabled={selectedInterests.length === 0} size="lg">
                      See Results <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Your Recommended Path</h2>
                  <p className="text-muted-foreground">Based on your GPA of {gpa} and interests.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   {recommendations.length > 0 ? recommendations.map((rec) => (
                     <Card key={rec.id} className="border-primary/50 shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                       <CardContent className="pt-6">
                         <h3 className="text-xl font-bold mb-2">{language === 'ar' ? rec.nameAr : rec.name}</h3>
                         <p className="text-sm text-muted-foreground mb-4">{language === 'ar' ? rec.descriptionAr : rec.description}</p>
                         <div className="flex gap-2 mb-6">
                            <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded font-bold">Recommended</span>
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">{rec.years} Years</span>
                         </div>
                         <Link href={`/universities`}>
                           <Button className="w-full">
                             View Offering Universities
                           </Button>
                         </Link>
                       </CardContent>
                     </Card>
                   )) : (
                     <div className="col-span-2 text-center p-12 bg-muted rounded-lg">
                       <p className="text-lg font-bold mb-2">No perfect matches found.</p>
                       <p className="text-muted-foreground">Try adjusting your GPA or interests to see more results.</p>
                       <Button variant="link" onClick={() => setStep(1)} className="mt-4">Start Over</Button>
                     </div>
                   )}
                </div>
                
                <div className="flex justify-center pt-8">
                   <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
