
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>
              Visualize e exporte relatórios das avaliações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                Os relatórios gerados aparecerão aqui
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
