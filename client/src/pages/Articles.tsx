import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { articles } from "@/lib/mockData";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Articles() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");

  const filteredArticles = articles.filter(a => {
    const title = language === 'ar' ? a.titleAr : a.title;
    const uni = language === 'ar' ? a.universityNameAr : a.universityName;
    return title.toLowerCase().includes(search.toLowerCase()) || 
           uni.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{t('articles')}</h1>
          <p className="text-muted-foreground">{t('latestArticles')}</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-md mb-8 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
           <Input 
             placeholder={t('search')} 
             className="pl-10 rtl:pl-3 rtl:pr-10"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col group cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={language === 'ar' ? article.titleAr : article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
                       {language === 'ar' ? article.universityNameAr : article.universityName}
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {language === 'ar' ? article.titleAr : article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.content}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex justify-between items-center">
                   <div className="flex items-center gap-1">
                     <Calendar className="h-3 w-3" />
                     {article.date}
                   </div>
                   <Button variant="link" size="sm" className="p-0 h-auto font-bold">
                     {t('readMore')}
                   </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
