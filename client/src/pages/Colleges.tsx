import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { colleges } from "@/lib/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Clock, Briefcase } from "lucide-react";

export default function Colleges() {
  const { t, language } = useLanguage();

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{t('colleges')}</h1>
          <p className="text-muted-foreground">{t('exploreColleges')}</p>
        </div>
      </div>

      <div className="container py-12">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {colleges.map((college) => (
            <AccordionItem key={college.id} value={college.id} className="border rounded-lg px-4 bg-card shadow-sm">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left rtl:text-right w-full">
                  <div className="h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img src={college.image} className="w-full h-full object-cover" alt={college.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{language === 'ar' ? college.nameAr : college.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {college.majors.length} Majors Available
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 border-t mt-2">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {college.majors.map((major) => (
                    <Card key={major.id} className="p-6 hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-lg mb-2">{language === 'ar' ? major.nameAr : major.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {language === 'ar' ? major.descriptionAr : major.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{major.years} Years</span>
                        </div>
                        {/* 
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>High Demand</span>
                        </div>
                        */}
                      </div>

                      <Link href="/universities">
                         <Button variant="outline" className="w-full group">
                           Find Universities
                           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:ml-0 rtl:mr-2 rtl:group-hover:-translate-x-1" />
                         </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}
