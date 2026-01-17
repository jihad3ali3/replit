import { useLanguage } from "@/contexts/LanguageContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { universities, articles } from "@/lib/mockData";
import { Link } from "wouter";
import { ArrowRight, Star, GraduationCap, BookOpen, Search } from "lucide-react";
import heroImage from "@assets/generated_images/modern_university_campus_hero.png";
import { motion } from "framer-motion";

export default function Home() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/universities">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg px-8">
                  {t('exploreUnis')}
                </Button>
              </Link>
              <Link href="/colleges">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  {t('exploreColleges')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features/Highlights */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('universities')}</h3>
              <p className="text-muted-foreground mb-4">
                Explore top-rated universities tailored to your academic profile and interests.
              </p>
              <Link href="/universities">
                <a className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  {t('readMore')} {isRtl ? <ArrowRight className="rotate-180 h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </a>
              </Link>
            </motion.div>

            <motion.div 
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('guidance')}</h3>
              <p className="text-muted-foreground mb-4">
                Get smart recommendations based on your GPA, interests, and career goals.
              </p>
              <Link href="/guidance">
                <a className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  {t('readMore')} {isRtl ? <ArrowRight className="rotate-180 h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </a>
              </Link>
            </motion.div>

            <motion.div 
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('articles')}</h3>
              <p className="text-muted-foreground mb-4">
                Stay updated with the latest educational trends, tips, and university news.
              </p>
              <Link href="/articles">
                <a className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  {t('readMore')} {isRtl ? <ArrowRight className="rotate-180 h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Universities */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('popularUniversities')}</h2>
              <div className="h-1 w-20 bg-secondary rounded-full" />
            </div>
            <Link href="/universities">
              <Button variant="outline">{t('exploreUnis')}</Button>
            </Link>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {universities.slice(0, 3).map((uni) => (
              <motion.div key={uni.id} variants={item} className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={uni.image} 
                    alt={language === 'ar' ? uni.nameAr : uni.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{language === 'ar' ? uni.nameAr : uni.name}</h3>
                    <div className="flex items-center gap-1 text-secondary-foreground bg-secondary/20 px-2 py-1 rounded text-xs font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      {uni.rating}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {language === 'ar' ? uni.descriptionAr : uni.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{language === 'ar' ? uni.locationAr : uni.location}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                     <span className="font-bold text-primary">
                       {uni.fees === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${uni.fees.toLocaleString()} SAR`}
                     </span>
                     <Link href={`/universities/${uni.id}`}>
                       <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                         {t('viewDetails')}
                       </Button>
                     </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
