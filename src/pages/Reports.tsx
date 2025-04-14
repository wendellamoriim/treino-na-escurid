
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Report {
  id: string;
  assessment_id: string;
  date: string;
  status: string;
  created_at: string;
  client?: {
    name: string;
  };
}

// Typing the raw response to better understand the structure
interface SupabaseReportResponse {
  id: string;
  assessment_id: string;
  date: string;
  status: string;
  created_at: string;
  assessments: {
    clientid: string;
    // The actual field holds an object, not an array
    clients: {
      name: string;
    }
  }
}

const Reports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Buscar relatórios do Supabase com informações do cliente
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id, 
          assessment_id, 
          date, 
          status, 
          created_at,
          assessments!inner(
            clientid,
            clients!inner(
              name
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar relatórios:", error);
        throw error;
      }
      
      console.log("Raw data from Supabase:", data);
      
      // Transformar os dados para o formato esperado
      const formattedData = data.map((report: any) => {
        // Logging to understand the structure
        console.log("Processing report:", report);
        
        let clientName = 'Cliente desconhecido';
        
        // Safely access client name handling different potential structures
        if (report.assessments && report.assessments.clients) {
          if (typeof report.assessments.clients === 'object' && report.assessments.clients.name) {
            // Direct object with name property
            clientName = report.assessments.clients.name;
          } else if (Array.isArray(report.assessments.clients) && report.assessments.clients.length > 0) {
            // Array of client objects
            clientName = report.assessments.clients[0].name;
          }
        }
        
        return {
          id: report.id,
          assessment_id: report.assessment_id,
          date: report.date,
          status: report.status,
          created_at: report.created_at,
          client: {
            name: clientName
          }
        };
      });
      
      return formattedData as Report[];
    }
  });

  const handleDownloadReport = (reportId: string) => {
    setLoading(true);
    
    // Simulação de download - em um caso real, isso faria uma chamada ao backend
    setTimeout(() => {
      toast({
        title: "Relatório Baixado",
        description: "O relatório foi baixado com sucesso.",
      });
      setLoading(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

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
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-muted-foreground">Carregando relatórios...</p>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{report.client?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Data: {formatDate(report.date)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32">
                <p className="text-muted-foreground">
                  Nenhum relatório encontrado. Finalize uma avaliação para gerar relatórios.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
