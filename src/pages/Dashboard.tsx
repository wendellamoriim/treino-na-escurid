
import { useEffect, useState } from 'react';
import { Users, ClipboardList, FileText } from 'lucide-react';
import { supabase, Client, Assessment } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Sample data for charts
  const assessmentData = [
    { name: 'Jan', count: 4 },
    { name: 'Fev', count: 7 },
    { name: 'Mar', count: 5 },
    { name: 'Abr', count: 10 },
    { name: 'Mai', count: 8 },
    { name: 'Jun', count: 12 },
  ];

  const clientProgressData = [
    { name: 'Semana 1', weight: 85 },
    { name: 'Semana 2', weight: 84 },
    { name: 'Semana 3', weight: 82 },
    { name: 'Semana 4', weight: 81 },
    { name: 'Semana 5', weight: 79 },
    { name: 'Semana 6', weight: 78 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch client count
        const { count: clientCount, error: clientError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
        
        if (clientError) throw clientError;
        setClientCount(clientCount || 0);
        
        // Fetch assessment count
        const { count: assessmentCount, error: assessmentError } = await supabase
          .from('assessments')
          .select('*', { count: 'exact', head: true });
        
        if (assessmentError) throw assessmentError;
        setAssessmentCount(assessmentCount || 0);
        
        // Fetch report count
        const { count: reportCount, error: reportError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });
        
        if (reportError) throw reportError;
        setReportCount(reportCount || 0);
        
        // Fetch recent clients
        const { data: recentClients, error: recentClientsError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentClientsError) throw recentClientsError;
        setRecentClients(recentClients || []);
        
        // Fetch recent assessments
        const { data: recentAssessments, error: recentAssessmentsError } = await supabase
          .from('assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentAssessmentsError) throw recentAssessmentsError;
        setRecentAssessments(recentAssessments || []);
        
      } catch (error: any) {
        console.error('Erro ao buscar dados do dashboard:', error.message);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar os dados do dashboard",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : clientCount}</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : assessmentCount}</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : reportCount}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Avaliações por Mês</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assessmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Progresso do Cliente (Peso em kg)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clientProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    dot={{ fill: '#8B5CF6', r: 4 }}
                    activeDot={{ r: 6, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent clients and assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Clientes Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando...</p>
              ) : recentClients.length > 0 ? (
                <div className="space-y-4">
                  {recentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(client.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Avaliações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando...</p>
              ) : recentAssessments.length > 0 ? (
                <div className="space-y-4">
                  {recentAssessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                      <div>
                        <p className="font-medium">{assessment.type}</p>
                        <p className="text-xs text-muted-foreground">Status: {assessment.status}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(assessment.date)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
