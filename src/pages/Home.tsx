import { Link } from 'react-router-dom';
import { Users, Clock, ClipboardList, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home = () => {
  const features = [
    {
      title: 'Çalışanlar',
      description: 'Çalışan bilgilerini ekleyin, düzenleyin ve yönetin.',
      icon: Users,
      path: '/employees',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Vardiyalar',
      description: 'Vardiya planlarını oluşturun ve zaman dilimlerini ayarlayın.',
      icon: Clock,
      path: '/shifts',
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
    {
      title: 'Atamalar',
      description: 'Çalışanları vardiyalara atayın ve programları yönetin.',
      icon: ClipboardList,
      path: '/assignments',
      color: 'text-success-foreground',
      bgColor: 'bg-success/20',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground" data-cy="home-title">
          Vardiya Yönetim Sistemi
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-cy="home-description">
          Çalışanları, vardiyaları ve görev atamalarını kolayca yönetin. Tüm vardiya planlaması
          ihtiyaçlarınız için kapsamlı bir çözüm.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.path}
              className="transition-all hover:shadow-lg hover:-translate-y-1"
              data-cy={`home-card-${feature.path.slice(1)}`}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full group"
                  data-cy={`home-btn-${feature.path.slice(1)}`}
                >
                  <Link to={feature.path}>
                    {feature.title} Sayfasına Git
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-secondary/50 border-none">
        <CardHeader>
          <CardTitle>Hızlı Başlangıç</CardTitle>
          <CardDescription>
            Sistemi kullanmaya başlamak için aşağıdaki adımları takip edin:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Çalışanları Ekleyin</p>
              <p className="text-sm text-muted-foreground">
                Öncelikle çalışan bilgilerini sisteme girin.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Vardiya Planları Oluşturun</p>
              <p className="text-sm text-muted-foreground">
                Vardiya saatlerini ve detaylarını tanımlayın.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Çalışanları Atayın</p>
              <p className="text-sm text-muted-foreground">
                Çalışanları uygun vardiyalara atayarak planlamayı tamamlayın.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
