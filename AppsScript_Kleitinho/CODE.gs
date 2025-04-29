function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index").setTitle("Simulador Altstreet");
}

function salvarDadosProjeto(dados) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Setup");
  const idProjeto = Utilities.getUuid().slice(0, 8);
  const datahora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

  const novaLinha = [
    datahora,
    idProjeto,
    dados.descricao,
    dados.prazoOperacao,
    dados.dataInicio,
    dados.tipologia,
    dados.precoAquisicao,
    dados.m2Habitacao,
    dados.vlrM2Obras,
    dados.custosObra,
    dados.vlrM2Venda,
    dados.vlrTotalVenda,
    dados.comissao + "%",
    dados.entradaFinanciamento + "%",
    dados.segurosMes,
    dados.condominioMes,
    dados.luzMes,
    dados.aguaMes
  ];

  sheet.insertRows(2);
  sheet.getRange(2, 1, 1, novaLinha.length).setValues([novaLinha]);
  SpreadsheetApp.flush();
  Utilities.sleep(1000);

  salvarAnaliseFinanceiraBD(idProjeto);
  return idProjeto;
}

function salvarAnaliseFinanceiraBD(idProjeto) {
  const ss = SpreadsheetApp.getActive();
  const bdSheet = ss.getSheetByName("AnaliseFinanceiraBD");

  const colInicio = 4; // Coluna D
  const linhaID = 2;
  const ultimaColuna = bdSheet.getLastColumn();
  const numLinhas = bdSheet.getMaxRows();

  const idsExistentes = bdSheet.getRange(linhaID, colInicio, 1, ultimaColuna - colInicio + 1).getValues()[0];
  if (idsExistentes.includes(idProjeto)) return;

  const numProjetos = idsExistentes.filter(id => id !== "").length;

  if (numProjetos > 0) {
    for (let i = numProjetos - 1; i >= 0; i--) {
      const origem = bdSheet.getRange(1, colInicio + i, numLinhas);
      const destino = bdSheet.getRange(1, colInicio + i + 1, numLinhas);
      origem.copyTo(destino);
    }
  }

  bdSheet.getRange(linhaID, colInicio).setValue(idProjeto);

  const blocos = [
    { linhaInicial: 3, linhaFinal: 32, linhaCalc: 6 },
    { linhaInicial: 33, linhaFinal: 62, linhaCalc: 19 },
    { linhaInicial: 63, linhaFinal: 77, linhaCalc: 32 },
    { linhaInicial: 78, linhaFinal: 107, linhaCalc: 40 },
    { linhaInicial: 108, linhaFinal: 119, linhaCalc: 53 },
  ];

  blocos.forEach(bloco => {
    const totalLinhas = bloco.linhaFinal - bloco.linhaInicial + 1;
    const formulas = [];

    for (let i = 0; i < totalLinhas; i++) {
      const linhaOffset = i % 3;
      const colCalc = ["F", "G", "H"][linhaOffset];
      const rowCalc = bloco.linhaCalc + Math.floor(i / 3);
      const formula = `=INDIRECT("Calculadora!${colCalc}$${rowCalc}")`;
      formulas.push([formula]);
    }

    bdSheet.getRange(bloco.linhaInicial, colInicio, totalLinhas, 1).setFormulas(formulas);
  });
}

function obterResultadosSimulacao(idProjeto) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("AnaliseFinanceiraBD");

  const header = sheet.getRange(2, 4, 1, sheet.getLastColumn() - 3).getValues()[0];
  const colIndex = header.findIndex(id => id === idProjeto);

  if (colIndex === -1) throw new Error("ID do projeto não encontrado.");

  const col = colIndex + 4;
  const valores = sheet.getRange(3, col, 117, 1).getValues().flat();

  return {
    "Resumo do Negócio": valores.slice(0, 30),
    "Análise de Rentabilidade Operação Plataforma": valores.slice(30, 60),
    "Análise de Rentabilidade Investidor": valores.slice(60, 75),
    "Profit & Loss Originadora": valores.slice(75, 105),
    "Distribuição dos Resultados (30/70)": valores.slice(105)
  };
}
