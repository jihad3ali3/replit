import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { universities, colleges, majors, articles } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, GraduationCap, Clock, DollarSign, BookOpen, ArrowLeft } from "lucide-react";
import NotFound from "./not-found";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function UniversityDetails() {
  const [match, params] = useRoute("/universities/:id");
  const { t, language } = useLanguage();
  
  if (!match) return <NotFound />;

  const uni = universities.find(u => u.id === params.id);
  if (!uni) return <NotFound />;

  // Mock filtering related data
  // In a real app, this would be a DB query
  const relatedArticles = articles.filter(a => a.universityId === uni.id);
  // For mockup, we show all colleges as if they belong to this uni, or filter if we had that relationship mapped
  // Let's assume all colleges are available at all unis for the mockup unless specified otherwise
  const uniColleges = colleges; 

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative h-[400px] bg-muted">
        <img 
          src={uni.image} 
          alt={uni.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-8">
          <Link href="/universities">
            <Button variant="ghost" size="sm" className="mb-4 text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" /> Back to List
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 shadow-sm">
                {language === 'ar' ? uni.nameAr : uni.name}
              </h1>
              <div className="flex items-center gap-4 text-foreground/80">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{language === 'ar' ? uni.locationAr : uni.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{uni.rating} / 5.0</span>
                </div>
              </div>
            </div>
            <Link href={`/apply/${uni.id}`}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8 shadow-lg">
                {t('apply')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-base"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="colleges" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-base"
            >
              Colleges & Majors
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-base"
            >
              News & Articles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-4">About University</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {language === 'ar' ? uni.descriptionAr : uni.description}
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                     {/* Mock Gallery */}
                     <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                       <img src={uni.image} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                     </div>
                     <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                     </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                 <Card>
                   <CardContent className="pt-6 space-y-4">
                     <h3 className="font-bold text-lg">Key Facts</h3>
                     <div className="space-y-3">
                       <div className="flex justify-between items-center py-2 border-b">
                         <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4"/> Tuition</span>
                         <span className="font-medium">{uni.fees === 0 ? 'Free' : `${uni.fees} SAR`}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b">
                         <span className="text-muted-foreground flex items-center gap-2"><GraduationCap className="h-4 w-4"/> Founded</span>
                         <span className="font-medium">1957</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b">
                         <span className="text-muted-foreground flex items-center gap-2"><BookOpen className="h-4 w-4"/> Programs</span>
                         <span className="font-medium">120+</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colleges">
            <div className="space-y-8">
              {uniColleges.map((college) => (
                <Card key={college.id} className="overflow-hidden">
                   <div className="bg-muted/30 p-4 border-b flex items-center gap-4">
                     <div className="h-12 w-12 rounded bg-white overflow-hidden border">
                        <img src={college.image} className="h-full w-full object-cover" />
                     </div>
                     <h3 className="text-xl font-bold">{language === 'ar' ? college.nameAr : college.name}</h3>
                   </div>
                   <div className="p-0">
                     <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead>Major</TableHead>
                           <TableHead>Duration</TableHead>
                           <TableHead>GPA Required</TableHead>
                           <TableHead className="text-right">Fees (Yearly)</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {college.majors.map((major) => (
                           <TableRow key={major.id}>
                             <TableCell className="font-medium">
                               <div>{language === 'ar' ? major.nameAr : major.name}</div>
                               <div className="text-xs text-muted-foreground">{language === 'ar' ? major.descriptionAr : major.description}</div>
                             </TableCell>
                             <TableCell>
                               <div className="flex items-center gap-1">
                                 <Clock className="h-3 w-3 text-muted-foreground" />
                                 {major.years} Years
                               </div>
                             </TableCell>
                             <TableCell>{major.gpa}</TableCell>
                             <TableCell className="text-right font-bold">
                               {major.fees.toLocaleString()} SAR
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                   </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.length > 0 ? relatedArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                      <img src={article.image} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{language === 'ar' ? article.titleAr : article.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        {article.date}
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No articles available for this university yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
