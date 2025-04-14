
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Assessments = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateNewAssessment = () => {
    setLoading(true);
    
    // In a real implementation, this would create an assessment in Supabase
    // For now, we'll just show a toast
    setTimeout(() => {
      toast({
        title: "Nova Avaliação",
        description: "Avaliação geral criada com sucesso!",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Avaliações</h1>
        
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Nova Avaliação</CardTitle>
            <CardDescription>
              Crie uma nova avaliação para seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleCreateNewAssessment} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {loading ? "Criando..." : "Nova Avaliação Geral"}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Ao clicar no botão acima, uma avaliação geral será criada automaticamente com todas as seções necessárias para um registro completo.
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Avaliações Recentes</CardTitle>
            <CardDescription>
              Visualize e gerencie as avaliações existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                As avaliações realizadas aparecerão aqui
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Assessments;
