# WebService de Notas Fiscais de Serviço da Facta Tecnologia

O WebService oferece três rotas com o seguintes serviços:

## Consulta `/consulta` - Método *GET*

Os parâmetros obrigatórios são `startDate` e `endDate`, ambos no formato `YYYY-MM-DD`. Seu JSON de retorno contém:

* ativas: Lista das Notas fiscais ativas (não canceladas) para aquele período
* canceladas: Lista das Notas fiscais canceladas para aquele período
* total_ativas: Soma dos valores das notas fiscais ativas
* total_canceladas: Soma dos valores das notas fiscais canceladas
* xml: XML original devolvido pelo WebService da PBH

## Cancelamento `/cancela` - Método *GET*

Cancela uma nota fiscal por vez, cujo número completo deve ser especificado através do parâmetro obrigatório `nfse`. O número nota deve ser formatado da mesma maneira que vem no XML de consulta retornado pelo WebService da PBH, com 15 dígitos (Ex: 201400000000008 para a nota 2014/8).

O retorno desse serviço é um json com um único campo:

* xml: contém o XML original retornado pelo WebService da PBH

## Geração `/gera` - Método *POST*

Emite a nota fiscal utilizando como parâmetros un JSON enviado no corpo da requisição. São necessários os seguintes parâmetros:

* `e_cnpj`: Indica se o tomador é uma pessoa jurídica caso possua valor `true`
* `tomador_nome`: Nome do Tomador (Cliente)
* `tomador_id`: CPF ou CNPJ do tomador
* `tomador_municipio`: **Código** do Município do tomador. O de Belo Horizonte é 3106200.
* `tomador_bairro`: Bairro do tomador
* `tomador_complemento`: Complemento do endereço do tomador (Apartamento, sala, loja, etc)
* `tomador_numero`: Número da localização do tomador (Ex: Rua João Silva, Número **30**)
* `tomador_endereco`: Endereço do Tomador, sem número. (Ex: Rua João Silva)
* `descricao_servico`: Descrição do Serviço prestado
* `valor_do_servico`: Bufunfa que vai entrar no nosso bolso
* `serie`: Número de série ou agrupador da nota. Coisa inútil que só serve para criar categorias de notas emitidas.

