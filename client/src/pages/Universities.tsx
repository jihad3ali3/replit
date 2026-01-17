import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { universities } from "@/lib/mockData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function Universities() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filteredUniversities = universities.filter((uni) => {
    const name = language === 'ar' ? uni.nameAr : uni.name;
    const location = language === 'ar' ? uni.locationAr : uni.location;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = uni.rating >= minRating;
    return matchesSearch && matchesRating;
  });

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{t('universities')}</h1>
          <p className="text-muted-foreground">{t('exploreUnis')}</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Filter className="h-5 w-5" />
                <span>Filter By</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Slider 
                  defaultValue={[0]} 
                  max={5} 
                  step={0.5} 
                  onValueChange={(vals) => setMinRating(vals[0])} 
                />
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>0</span>
                  <span>5 Stars</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riyadh">Riyadh</SelectItem>
                    <SelectItem value="jeddah">Jeddah</SelectItem>
                    <SelectItem value="dammam">Dammam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                <Input 
                  placeholder={t('search')} 
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="rating">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="fees_low">Lowest Fees</SelectItem>
                  <SelectItem value="fees_high">Highest Fees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredUniversities.map((uni) => (
                <motion.div 
                  key={uni.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <Link href={`/universities/${uni.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col group">
                      <div className="aspect-video overflow-hidden relative">
                        <img 
                          src={uni.image} 
                          alt={uni.name} 
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {uni.rating}
                        </div>
                      </div>
                      <CardHeader>
                        <h3 className="text-xl font-bold">{language === 'ar' ? uni.nameAr : uni.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {language === 'ar' ? uni.locationAr : uni.location}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {language === 'ar' ? uni.descriptionAr : uni.description}
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between items-center bg-muted/20">
                        <span className="font-bold text-primary">
                          {uni.fees === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${uni.fees.toLocaleString()} SAR`}
                        </span>
                        <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-white transition-colors">
                          {t('viewDetails')}
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredUniversities.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No universities found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
