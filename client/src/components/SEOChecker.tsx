import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Eye, Globe, Facebook, Twitter } from "lucide-react";

interface SEOCheckResult {
  category: string;
  item: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  value?: string;
}

export function SEOChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<SEOCheckResult[]>([]);

  // Charger les paramètres SEO
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
    select: (data: any[]) => {
      const settingsMap: any = {};
      data.forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });
      return settingsMap;
    }
  });

  const checkSEO = () => {
    setIsChecking(true);
    const checks: SEOCheckResult[] = [];

    // Vérification des meta tags de base
    const metaTitle = document.querySelector('title')?.textContent;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');

    // Meta Title
    if (metaTitle) {
      if (metaTitle.length >= 50 && metaTitle.length <= 60) {
        checks.push({
          category: 'SEO de base',
          item: 'Meta Title',
          status: 'success',
          message: `Longueur optimale: ${metaTitle.length} caractères`,
          value: metaTitle
        });
      } else if (metaTitle.length > 0) {
        checks.push({
          category: 'SEO de base',
          item: 'Meta Title',
          status: 'warning',
          message: `Longueur: ${metaTitle.length} caractères (recommandé: 50-60)`,
          value: metaTitle
        });
      }
    } else {
      checks.push({
        category: 'SEO de base',
        item: 'Meta Title',
        status: 'error',
        message: 'Meta title manquant'
      });
    }

    // Meta Description
    if (metaDescription) {
      if (metaDescription.length >= 150 && metaDescription.length <= 160) {
        checks.push({
          category: 'SEO de base',
          item: 'Meta Description',
          status: 'success',
          message: `Longueur optimale: ${metaDescription.length} caractères`,
          value: metaDescription
        });
      } else if (metaDescription.length > 0) {
        checks.push({
          category: 'SEO de base',
          item: 'Meta Description',
          status: 'warning',
          message: `Longueur: ${metaDescription.length} caractères (recommandé: 150-160)`,
          value: metaDescription
        });
      }
    } else {
      checks.push({
        category: 'SEO de base',
        item: 'Meta Description',
        status: 'error',
        message: 'Meta description manquante'
      });
    }

    // Meta Keywords
    if (metaKeywords) {
      checks.push({
        category: 'SEO de base',
        item: 'Meta Keywords',
        status: 'success',
        message: 'Mots-clés configurés',
        value: metaKeywords
      });
    } else {
      checks.push({
        category: 'SEO de base',
        item: 'Meta Keywords',
        status: 'warning',
        message: 'Mots-clés manquants'
      });
    }

    // Vérification Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');

    checks.push({
      category: 'Open Graph',
      item: 'OG Title',
      status: ogTitle ? 'success' : 'error',
      message: ogTitle ? 'Titre Open Graph configuré' : 'Titre Open Graph manquant',
      value: ogTitle || undefined
    });

    checks.push({
      category: 'Open Graph',
      item: 'OG Description',
      status: ogDescription ? 'success' : 'error',
      message: ogDescription ? 'Description Open Graph configurée' : 'Description Open Graph manquante',
      value: ogDescription || undefined
    });

    checks.push({
      category: 'Open Graph',
      item: 'OG Image',
      status: ogImage ? 'success' : 'warning',
      message: ogImage ? 'Image Open Graph configurée' : 'Image Open Graph manquante',
      value: ogImage || undefined
    });

    // Vérification Twitter Cards
    const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content');

    checks.push({
      category: 'Twitter Cards',
      item: 'Twitter Card Type',
      status: twitterCard ? 'success' : 'error',
      message: twitterCard ? `Type: ${twitterCard}` : 'Twitter Card manquante',
      value: twitterCard || undefined
    });

    checks.push({
      category: 'Twitter Cards',
      item: 'Twitter Title',
      status: twitterTitle ? 'success' : 'error',
      message: twitterTitle ? 'Titre Twitter configuré' : 'Titre Twitter manquant',
      value: twitterTitle || undefined
    });

    // Vérification des pixels de suivi
    const checkTrackingPixels = () => {
      // Google Analytics
      if (window.gtag) {
        checks.push({
          category: 'Pixels de suivi',
          item: 'Google Analytics',
          status: 'success',
          message: 'Google Analytics chargé'
        });
      } else if (settings?.google_analytics_id) {
        checks.push({
          category: 'Pixels de suivi',
          item: 'Google Analytics',
          status: 'warning',
          message: 'Google Analytics configuré mais non chargé'
        });
      } else {
        checks.push({
          category: 'Pixels de suivi',
          item: 'Google Analytics',
          status: 'error',
          message: 'Google Analytics non configuré'
        });
      }

      // Facebook Pixel
      if (window.fbq) {
        checks.push({
          category: 'Pixels de suivi',
          item: 'Facebook Pixel',
          status: 'success',
          message: 'Facebook Pixel chargé'
        });
      } else if (settings?.facebook_pixel_id) {
        checks.push({
          category: 'Pixels de suivi',
          item: 'Facebook Pixel',
          status: 'warning',
          message: 'Facebook Pixel configuré mais non chargé'
        });
      } else {
        checks.push({
          category: 'Pixels de suivi',
          item: 'Facebook Pixel',
          status: 'error',
          message: 'Facebook Pixel non configuré'
        });
      }
    };

    // Vérification des données structurées
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      try {
        JSON.parse(structuredData.textContent || '');
        checks.push({
          category: 'Données structurées',
          item: 'JSON-LD',
          status: 'success',
          message: 'Données structurées valides'
        });
      } catch (error) {
        checks.push({
          category: 'Données structurées',
          item: 'JSON-LD',
          status: 'error',
          message: 'Données structurées invalides'
        });
      }
    } else {
      checks.push({
        category: 'Données structurées',
        item: 'JSON-LD',
        status: 'warning',
        message: 'Données structurées manquantes'
      });
    }

    // Vérification de la langue
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      checks.push({
        category: 'Internationalisation',
        item: 'Langue HTML',
        status: 'success',
        message: `Langue définie: ${htmlLang}`
      });
    } else {
      checks.push({
        category: 'Internationalisation',
        item: 'Langue HTML',
        status: 'error',
        message: 'Langue HTML non définie'
      });
    }

    // Vérification des liens hreflang
    const hreflangLinks = document.querySelectorAll('link[hreflang]');
    if (hreflangLinks.length > 0) {
      checks.push({
        category: 'Internationalisation',
        item: 'Liens Hreflang',
        status: 'success',
        message: `${hreflangLinks.length} liens hreflang trouvés`
      });
    } else {
      checks.push({
        category: 'Internationalisation',
        item: 'Liens Hreflang',
        status: 'warning',
        message: 'Liens hreflang manquants'
      });
    }

    // Vérification du canonical
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    if (canonical) {
      checks.push({
        category: 'SEO technique',
        item: 'URL Canonique',
        status: 'success',
        message: 'URL canonique définie',
        value: canonical
      });
    } else {
      checks.push({
        category: 'SEO technique',
        item: 'URL Canonique',
        status: 'warning',
        message: 'URL canonique manquante'
      });
    }

    // Vérification des robots
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content');
    if (robots) {
      checks.push({
        category: 'SEO technique',
        item: 'Robots Meta',
        status: 'success',
        message: `Robots: ${robots}`
      });
    } else {
      checks.push({
        category: 'SEO technique',
        item: 'Robots Meta',
        status: 'warning',
        message: 'Robots meta manquant'
      });
    }

    checkTrackingPixels();
    setResults(checks);
    setIsChecking(false);
  };

  useEffect(() => {
    // Vérification automatique au chargement
    const timer = setTimeout(() => {
      checkSEO();
    }, 2000);

    return () => clearTimeout(timer);
  }, [settings]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">OK</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      default:
        return null;
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SEOCheckResult[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SEO de base':
        return <Globe className="h-5 w-5" />;
      case 'Open Graph':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'Twitter Cards':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'Pixels de suivi':
        return <Eye className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalScore = results.length > 0 ? Math.round((successCount / results.length) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vérification SEO</span>
          <Button 
            onClick={checkSEO} 
            disabled={isChecking}
            size="sm"
          >
            {isChecking ? 'Vérification...' : 'Relancer la vérification'}
          </Button>
        </CardTitle>
        {results.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-purple-600">
              Score: {totalScore}%
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                {successCount} OK
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800">
                {warningCount} Attention
              </Badge>
              <Badge className="bg-red-100 text-red-800">
                {errorCount} Erreurs
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Aucune vérification effectuée. Cliquez sur "Relancer la vérification" pour commencer.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([category, categoryResults]) => (
              <div key={category}>
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-3">
                  {getCategoryIcon(category)}
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryResults.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(result.status)}
                        <div>
                          <div className="font-medium">{result.item}</div>
                          <div className="text-sm text-gray-600">{result.message}</div>
                          {result.value && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {result.value.length > 100 
                                ? `${result.value.substring(0, 100)}...` 
                                : result.value}
                            </div>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}