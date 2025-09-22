import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/request/order.dto';
import { CAIXAS_DISPONIVEIS } from './constants/packaging.constants';
import { Caixa, CaixaEmUso, Dimensoes, Produto, ResultadoCaixa } from './interfaces/packing.interfaces';

@Injectable()
export class PackingService {

  public processarPedido(pedido: OrderDto) {
    const produtosOrdenados = [...pedido.produtos].sort(
      (a, b) => this.getVolume(b.dimensoes) - this.getVolume(a.dimensoes),
    );

    const caixasDoPedido: CaixaEmUso[] = [];
    const produtosNaoEmpacotaveis: Produto[] = [];

    for (const produto of produtosOrdenados) {
      const volProduto = this.getVolume(produto.dimensoes);
      let alocado = false;

      let melhorCaixaAberta: CaixaEmUso | null = null;
      let menorSobraAberta = Infinity;

      for (const caixaEmUso of caixasDoPedido) {
        if (!this.produtoCabeNaCaixa(produto.dimensoes, caixaEmUso.tipoCaixa)) continue;

        const sobraSeInserir = caixaEmUso.tipoCaixa.volume - (caixaEmUso.volumeOcupado + volProduto);
        if (sobraSeInserir >= 0 && sobraSeInserir < menorSobraAberta) {
          melhorCaixaAberta = caixaEmUso;
          menorSobraAberta = sobraSeInserir;
        }
      }

      if (melhorCaixaAberta) {
        melhorCaixaAberta.produtos.push(produto);
        melhorCaixaAberta.volumeOcupado += volProduto;
        alocado = true;
        continue;
      }

      let melhorCaixaNova: Caixa | null = null;
      let menorSobraNova = Infinity;

      for (const tipoCaixa of CAIXAS_DISPONIVEIS) {
        if (!this.produtoCabeNaCaixa(produto.dimensoes, tipoCaixa)) continue;
        const sobraDeVolume = tipoCaixa.volume - volProduto;
        if (sobraDeVolume >= 0 && sobraDeVolume < menorSobraNova) {
          melhorCaixaNova = tipoCaixa;
          menorSobraNova = sobraDeVolume;
        }
      }
      
      if (melhorCaixaNova) {
        const novaCaixa: CaixaEmUso = {
          tipoCaixa: melhorCaixaNova,
          produtos: [produto],
          volumeOcupado: volProduto,
        };
        caixasDoPedido.push(novaCaixa);
        alocado = true;
      }

      if (!alocado) {
        produtosNaoEmpacotaveis.push(produto);
      }
    }

    return this.formatarSaida(pedido.pedido_id, caixasDoPedido, produtosNaoEmpacotaveis);
  }

  private produtoCabeNaCaixa(dimensoesProduto: Dimensoes, dimensoesCaixa: Dimensoes): boolean {
    const p = [dimensoesProduto.altura, dimensoesProduto.largura, dimensoesProduto.comprimento].slice();
    const c = [dimensoesCaixa.altura, dimensoesCaixa.largura, dimensoesCaixa.comprimento].slice();

    p.sort((a, b) => b - a);
    c.sort((a, b) => b - a);

    return p[0] <= c[0] && p[1] <= c[1] && p[2] <= c[2];
  }

  private getVolume(dimensoes: Dimensoes): number {
    return dimensoes.altura * dimensoes.largura * dimensoes.comprimento;
  }
  
  private formatarSaida(pedidoId: number, caixas: CaixaEmUso[], naoEmpacotaveis: Produto[]) {
    const resultadoCaixas: ResultadoCaixa[] = caixas.map((caixa) => ({
      caixa_id: caixa.tipoCaixa.id,
      produtos: caixa.produtos.map((p) => p.produto_id),
    }));

    if (naoEmpacotaveis.length > 0) {
      resultadoCaixas.push({
        caixa_id: null,
        produtos: naoEmpacotaveis.map((p) => p.produto_id),
        observacao: 'Produto(s) não cabe(m) em nenhuma caixa disponível.',
      });
    }

    return {
      pedido_id: pedidoId,
      caixas: resultadoCaixas,
    };
  }
}