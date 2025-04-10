import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SimuladorAltstreet() {
  const [formData, setFormData] = useState({
    prazoOperacao: '',
    precoAquisicao: '',
    custosAquisicao: '',
    custosObras: '',
    custosVenda: '',
    custosTransitorios: '',
    precoVenda: '',
    capitalProprio: ''
  });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalcular = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbx0jXRCa14-A7RrJYrusgSrVAdr5se3lPbHTTf3wB9HHhkIAPIXqTDRqtGIf8KYsgIt/exec',
        {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      setResultado(result);
    } catch (error) {
      alert('Erro ao calcular. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img src="/altstreet-logo.png" alt="Altstreet" className="h-12 mb-6" />

      <h1 className="text-2xl font-bold mb-4">Simulador Financeiro Altstreet</h1>

      <div className="grid grid-cols-2 gap-4">
        <Input name="prazoOperacao" placeholder="Prazo da Operação (meses)" value={formData.prazoOperacao} onChange={handleChange} required />
        <Input name="precoAquisicao" placeholder="Preço de Aquisição" value={formData.precoAquisicao} onChange={handleChange} required />
        <Input name="custosAquisicao" placeholder="Custos com Aquisição" value={formData.custosAquisicao} onChange={handleChange} required />
        <Input name="custosObras" placeholder="Custos com Obras" value={formData.custosObras} onChange={handleChange} required />
        <Input name="custosVenda" placeholder="Custos com Venda" value={formData.custosVenda} onChange={handleChange} required />
        <Input name="custosTransitorios" placeholder="Custos Transitórios" value={formData.custosTransitorios} onChange={handleChange} required />
        <Input name="precoVenda" placeholder="Preço Estimado de Venda" value={formData.precoVenda} onChange={handleChange} required />
        <Input name="capitalProprio" placeholder="Capital próprio no negócio" value={formData.capitalProprio} onChange={handleChange} required />
      </div>

      <Button className="mt-6 w-full" onClick={handleCalcular} disabled={loading}>
        {loading ? 'Calculando...' : 'Calcular'}
      </Button>

      {resultado && (
        <Card className="mt-6">
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
