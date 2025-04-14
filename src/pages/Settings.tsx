
import { useState } from 'react';
import { Shield, Copyright, Send, MessageSquareText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const [suggestion, setSuggestion] = useState('');
  const [feedbackType, setFeedbackType] = useState('compliment');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendSuggestion = () => {
    setLoading(true);
    
    // This would normally send data to Supabase
    setTimeout(() => {
      toast({
        title: "Sugestão enviada",
        description: "Obrigado pelo seu feedback!",
      });
      setLoading(false);
      setSuggestion('');
    }, 1000);
  };

  const handleSendFeedback = () => {
    setLoading(true);
    
    // This would normally send data to Supabase
    setTimeout(() => {
      toast({
        title: "Feedback enviado",
        description: "Obrigado pelo seu feedback!",
      });
      setLoading(false);
      setFeedbackContent('');
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Configurações</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Enviar Sugestão
              </CardTitle>
              <CardDescription>
                Ajude-nos a melhorar a plataforma com suas sugestões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="suggestion">Sua sugestão</Label>
                  <Textarea
                    id="suggestion"
                    placeholder="Escreva sua sugestão aqui..."
                    className="min-h-32 bg-secondary/50"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendSuggestion} 
                disabled={loading || !suggestion.trim()}
                className="w-full"
              >
                {loading ? "Enviando..." : "Enviar Sugestão"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquareText className="h-5 w-5 mr-2" />
                Feedback
              </CardTitle>
              <CardDescription>
                Envie-nos um elogio, crítica ou reclamação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de feedback</Label>
                  <RadioGroup 
                    value={feedbackType} 
                    onValueChange={setFeedbackType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compliment" id="compliment" />
                      <Label htmlFor="compliment">Elogio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="criticism" id="criticism" />
                      <Label htmlFor="criticism">Crítica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complaint" id="complaint" />
                      <Label htmlFor="complaint">Reclamação</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Seu feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Escreva seu feedback aqui..."
                    className="min-h-24 bg-secondary/50"
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendFeedback} 
                disabled={loading || !feedbackContent.trim()}
                className="w-full"
              >
                {loading ? "Enviando..." : "Enviar Feedback"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Aviso LGPD
              </CardTitle>
              <CardDescription>
                Informações sobre a proteção de dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Ver aviso LGPD</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Aviso de Proteção de Dados (LGPD)</DialogTitle>
                    <DialogDescription>
                      Política de proteção de dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <p>
                      Este aviso explica como coletamos, usamos, compartilhamos e protegemos os dados pessoais dos clientes da nossa plataforma de avaliação física para personal trainers.
                    </p>
                    <h3 className="text-lg font-semibold">1. Dados Coletados</h3>
                    <p>
                      Coletamos dados pessoais como nome, email, telefone, CPF, além de informações médicas e físicas durante as avaliações, como peso, altura, medidas corporais e histórico de saúde.
                    </p>
                    <h3 className="text-lg font-semibold">2. Finalidade</h3>
                    <p>
                      Utilizamos os dados para realizar avaliações físicas, acompanhar a evolução dos clientes, elaborar planos de treinamento personalizados e gerar relatórios.
                    </p>
                    <h3 className="text-lg font-semibold">3. Segurança</h3>
                    <p>
                      Implementamos medidas técnicas e organizacionais para proteger os dados contra acessos não autorizados, perda ou alteração indevida.
                    </p>
                    <h3 className="text-lg font-semibold">4. Seus Direitos</h3>
                    <p>
                      Você tem direito a acessar, corrigir, atualizar e solicitar a exclusão dos seus dados pessoais, conforme previsto na LGPD.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copyright className="h-5 w-5 mr-2" />
                Direitos Autorais
              </CardTitle>
              <CardDescription>
                Informações sobre direitos autorais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Ver aviso de direitos autorais</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Aviso de Direitos Autorais</DialogTitle>
                    <DialogDescription>
                      Informações sobre propriedade e uso do conteúdo da plataforma
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <p>
                      © {new Date().getFullYear()} TreinoGym. Todos os direitos reservados.
                    </p>
                    <p>
                      Todo o conteúdo desta plataforma, incluindo textos, gráficos, logotipos, ícones, imagens e software, é propriedade exclusiva da TreinoGym e está protegido por leis de direitos autorais brasileiras e internacionais.
                    </p>
                    <p>
                      É proibida a reprodução total ou parcial do conteúdo desta plataforma para fins comerciais sem a autorização prévia por escrito.
                    </p>
                    <p>
                      A TreinoGym e os personal trainers que utilizam esta plataforma detêm o direito exclusivo sobre os relatórios, avaliações e demais materiais produzidos dentro do sistema.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Fechar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
