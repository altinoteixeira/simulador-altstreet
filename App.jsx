import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

export default function SimuladorAltstreet() {
  const [formData, setFormData] = useState({
    Descricao: '',
    Tipologia: '',
    precoAquisicao: '',
    m2Externa: '',
    m2Habitacao: '',
    vlrM2Venda: '',
    vlrTotalVenda: '',
    vlrM2Obras: '',
    vlrOutrosCustosObras: '',
    percentualComissao: '',
    percentualEntradaFinanciamento: '',
    prazoOperacao: '',
    seguroMes: '',
    condominioMes: '',
    luzMes: '',
    aguaMes: ''
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
      const response = await fetch("https://script.google.com/macros/s/AKfycbxYPzeaQ9KPNLB-2s17dM2sW0TZYocg_iKlfogAXgc/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: formData })
      });

      const result = await response.json();
      setResultado(result);
    } catch (error) {
      alert('Erro ao calcular. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <img src="/altstreet-logo.png" alt="Altstreet" className="h-12 mb-6" />
      <h1 className="text-2xl font-bold mb-4">Simulador Financeiro Altstreet</h1>

      <div className="grid grid-cols-2 gap-4">
        <Input name="Descricao" placeholder="Descrição" value={formData.Descricao} onChange={handleChange} required />
        <Input name="Tipologia" placeholder="Tipologia" value={formData.Tipologia} onChange={handleChange} required />
        <Input name="precoAquisicao" placeholder="Preço de Aquisição" value={formData.precoAquisicao} onChange={handleChange} required />
        <Input name="m2Externa" placeholder="M² Externa" value={formData.m2Externa} onChange={handleChange} required />
        <Input name="m2Habitacao" placeholder="M² Habitação" value={formData.m2Habitacao} onChange={handleChange} required />
        <Input name="vlrM2Venda" placeholder="Valor M² Venda" value={formData.vlrM2Venda} onChange={handleChange} required />
        <Input name="vlrTotalVenda" placeholder="Valor Total Venda" value={formData.vlrTotalVenda} onChange={handleChange} required />
        <Input name="vlrM2Obras" placeholder="Valor M² Obras" value={formData.vlrM2Obras} onChange={handleChange} required />
        <Input name="vlrOutrosCustosObras" placeholder="Outros Custos de Obras" value={formData.vlrOutrosCustosObras} onChange={handleChange} required />
        <Input name="percentualComissao" placeholder="% Comissão" value={formData.percentualComissao} onChange={handleChange} required />
        <Input name="percentualEntradaFinanciamento" placeholder="% Entrada Financiamento" value={formData.percentualEntradaFinanciamento} onChange={handleChange} required />
        <Input name="prazoOperacao" placeholder="Prazo da Operação (meses)" value={formData.prazoOperacao} onChange={handleChange} required />
        <Input name="seguroMes" placeholder="Seguros (mês)" value={formData.seguroMes} onChange={handleChange} required />
        <Input name="condominioMes" placeholder="Condomínio (mês)" value={formData.condominioMes} onChange={handleChange} required />
        <Input name="luzMes" placeholder="Luz (mês)" value={formData.luzMes} onChange={handleChange} required />
        <Input name="aguaMes" placeholder="Água (mês)" value={formData.aguaMes} onChange={handleChange} required />
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
