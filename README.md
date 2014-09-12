# WebService de Notas Fiscais de Serviço da Facta Tecnologia

O WebService oferece três rotas com o seguintes serviços:

## Consulta `/consulta`

Os parâmetros obrigatórios são `startDate` e `endDate`, ambos no formato `YYYY-MM-DD`. Seu JSON de retorno contém:

* ativas: Lista das Notas fiscais ativas (não canceladas) para aquele período
* canceladas: Lista das Notas fiscais canceladas para aquele período
* total_ativas: Soma dos valores das notas fiscais ativas
* total_canceladas: Soma dos valores das notas fiscais canceladas
* xml: XML original devolvido pelo WebService da PBH

## Cancelamento `/cancelamento`

Cancela uma nota fiscal por vez, cujo número completo deve ser especificado através do parâmetro obrigatório `nfse`. O número nota deve ser formatado da mesma maneira que vem no XML de consulta retornado pelo WebService da PBH, com 15 dígitos (Ex: 201400000000008 para a nota 2014/8).

O retorno desse serviço é um json com um único campo:

* xml: contém o XML original retornado pelo WebService da PBH