
import { useState } from 'react';
import { PlusCircle, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Definição do tipo de cliente
interface Client {
  id: string;
  name: string;
  email: string;
}

const Assessments = () => {
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [assessmentCreated, setAssessmentCreated] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm();

  // Buscar clientes do Supabase
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email');
      
      if (error) {
        throw error;
      }
      
      return data as Client[];
    }
  });

  const handleCreateNewAssessment = async () => {
    if (!selectedClientId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Criar nova avaliação no Supabase
      const { data, error } = await supabase
        .from('assessments')
        .insert([
          { 
            clientid: selectedClientId,
            date: new Date().toISOString(),
            type: 'geral',
            status: 'em_andamento' 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setCurrentAssessmentId(data.id);
      setAssessmentCreated(true);
      
      toast({
        title: "Nova Avaliação",
        description: "Avaliação iniciada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a avaliação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessment = async () => {
    if (!currentAssessmentId) return;
    
    setLoading(true);
    
    try {
      // Aqui seria inserido os dados do formulário completo
      // Por enquanto, vamos apenas simular que a avaliação foi concluída
      const { error } = await supabase
        .from('assessments')
        .update({ status: 'concluido' })
        .eq('id', currentAssessmentId);
      
      if (error) throw error;
      
      // Simular inserção de dados de avaliação
      const { error: detailsError } = await supabase
        .from('assessment_details')
        .insert([
          { 
            assessment_id: currentAssessmentId,
            form_data: JSON.stringify({
              anamnesis: {
                completed: true,
                // Aqui viriam os dados reais do formulário
              },
              anthropometric: {
                completed: true,
                // Dados antropométricos
              },
              // Outras seções da avaliação
            })
          }
        ]);
      
      if (detailsError) throw detailsError;
      
      // Criar um novo relatório para esta avaliação
      const { error: reportError } = await supabase
        .from('reports')
        .insert([
          { 
            assessment_id: currentAssessmentId,
            date: new Date().toISOString(),
            status: 'disponivel'
          }
        ]);
      
      if (reportError) throw reportError;
      
      toast({
        title: "Avaliação Salva",
        description: "Avaliação finalizada e relatório gerado com sucesso!",
      });
      
      // Resetar o estado para permitir novas avaliações
      setAssessmentCreated(false);
      setCurrentAssessmentId(null);
      setSelectedClientId(null);
      
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a avaliação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full sm:w-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Avaliação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Avaliação</DialogTitle>
                  <DialogDescription>
                    Selecione o cliente para criar uma nova avaliação.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              setSelectedClientId(value);
                              field.onChange(value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingClients ? (
                                <SelectItem value="loading" disabled>Carregando...</SelectItem>
                              ) : clients && clients.length > 0 ? (
                                clients.map((client) => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="empty" disabled>Nenhum cliente encontrado</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateNewAssessment} 
                    disabled={loading || !selectedClientId}
                  >
                    {loading ? "Criando..." : "Criar Avaliação"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <p className="text-sm text-muted-foreground mt-4">
              Ao clicar no botão acima, você poderá selecionar um cliente e iniciar uma avaliação geral completa.
            </p>
          </CardContent>
        </Card>
        
        {assessmentCreated && (
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Avaliação em Andamento</CardTitle>
              <CardDescription>
                Preencha todas as etapas da avaliação e salve ao finalizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Etapas da Avaliação</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>1. Anamnese</span>
                      <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">Concluído</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>2. Avaliação Antropométrica</span>
                      <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">Concluído</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>3. Avaliação Postural</span>
                      <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">Concluído</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>4. Avaliação de Flexibilidade</span>
                      <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">Concluído</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>5. Avaliação de Força Muscular</span>
                      <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">Concluído</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <span>6. Avaliação Cardiovascular</span>
                      <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">Concluído</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveAssessment} 
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Avaliação"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
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
