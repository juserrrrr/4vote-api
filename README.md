
<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=02A6F4&height=120&section=header"/>

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/4vote%20principal.png">
 </div>
 
[![Typing SVG](https://readme-typing-svg.herokuapp.com/?color=052A76&size=35&center=true&vCenter=true&width=1000&lines=Uma+plataforma+intuitiva+e+poderosa;Projetada+para+tornar+suas+enquetes+e+votações;Uma+experiência+fácil,+envolvente+e+significativa.)](https://git.io/typing-svg)

##

<div align="center">  
  <img width=40% src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=02A6F4&style=for-the-badge"/>
</div>

<div align="center">
 <a href="#-sobre-o-projeto"> Sobre</a> • 
 <a href="#-funcionalidades"> Funcionalidades</a> • 
 <a href="#-layout"> Layout</a> • 
 <a href="#-exemplo-de-uso"> Usabilidade</a> • 
 <a href="#-tecnologias"> Tecnologias</a> • 
 <a href="#-desenvolvedores"> Desenvolvedores</a>
</div>

## 🗒️ Sobre o Projeto

Este projeto é um sistema de Votação/Enquete online que permite aos usuários criar e participar de Votações/Enquetes de forma segura e transparente. 
O sistema inclui uma funcionalidade de auditoria baseada em hash MD5 para garantir a integridade dos votos.


## ⚙️ Funcionalidades

1. **Autenticação de Usuário**: O sistema permite que os usuários se autentiquem para acessar as funcionalidades de criação de votações/enquetes e de participação.  
2. **Criação de Votação/Enquete**: Os usuários podem criar votações/enquetes, fornecendo um título, uma descrição, opções de resposta e uma data limite para votação. 
3. **Geração de Código Único**: Após a criação da votação/enquete, o sistema gera um código único que será usado para acessar a votação/enquete.
4. **Participação na Votação/Enquete**: Os usuários podem participar de votações/enquetes usando o código gerado. Eles devem selecionar uma opção de resposta e fornecer seu endereço de e-mail para verificação.
5. **Auditoria por Hash MD5**: Cada voto registrado no sistema é associado a uma hash MD5 única, gerada com base nos dados do voto. Essa hash é enviada por e-mail para o eleitor como uma forma de verificar seu voto.
6. **Finalização da Votação/Enquete**: O criador da votação/enquete pode finalizá-la manualmente ou automaticamente após a data limite estabelecida. Após a finalização, a votação/enquete não pode ser reaberta e os resultados finais são mostrados ao criador.
7. **Segurança e Confidencialidade**: O sistema é desenvolvido com medidas de segurança robustas para proteger os dados dos usuários e garantir a confidencialidade das votações/enquetes.


## 🎨 Layout

**O layout completo da aplicação está disponível no Figma:** 
<a href="https://www.figma.com/file/dSK71484PNxGBrfHIaj6Jb/4Vote?type=design&node-id=1-2&mode=design&t=nDHoVIoWOr2Pg0lU-0">
  <img alt="4Vote" src="https://img.shields.io/badge/Acessar%20Layout%20-Figma-%23052A76">
</a>

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/landpage.jpg">
</div>

## 🖱️Exemplo de Uso

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/login.jpg">
 </div>

Após clicar em “Entrar” e acessar a conta inserindo o email e a senha cadastrados, o usuário acessa o sistema conectado em sua conta o que lhe permite ter acesso a todas as funcionalidades bem como criar enquetes/votações, participar e consultar o resultado final destas.
 
##

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/enquete.jpg">
 </div>
Após clicar em “Criar” e “Criar Enquete”, o usuário é direcionado para uma nova tela onde realiza o preenchimento dos dados referentes à enquete que deseja criar. Os campos a serem preenchidos são:   

* O título da enquete, que será apresentado aos participantes;    
* A data limite para encerramento da enquete;    
* O tipo de acesso: público ou privado, que define quem pode participar da enquete. Sendo público aberto a todos ou privado para um grupo restrito;  
* A descrição da enquete, que fornece mais detalhes sobre o seu propósito;    
* A pergunta da enquete, que é a questão principal a ser respondida;    
* As respectivas opções de resposta, que são as alternativas que os participantes podem escolher;   
* Imagens associadas a estas opções de resposta, que ajudam a ilustrar cada alternativa.    

O usuário tem ainda a opção de criar novas perguntas para compor a enquete clicando em “Nova Pergunta”. Cada pergunta adicional segue o mesmo formato da inicial, incluindo a nova pergunta, as opções de resposta e as imagens associadas. Se o usuário desejar remover uma pergunta adicionada, pode clicar no botão “Remover Pergunta”. Da mesma forma, o usuário pode remover uma opção de resposta clicando no “x” ao lado de cada opção. 
Após preencher todos os campos e adicionar todas as perguntas desejadas, o usuário pode clicar no botão “Criar Enquete” para confirmar sua criação. Uma vez criada, a enquete fica disponível para os participantes de acordo com o tipo de acesso definido.

##

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/responderEnquete.jpg">
</div>

Após clicar em “Participar” e no caso de enquetes privadas inserir o código da enquete, ou selecionar alguma enquete pública, o usuário é direcionado para uma nova tela onde pode visualizar as informações da enquete e participar da mesma.        
Para responder a enquete, o usuário deve clicar sobre a alternativa de sua preferência para selecioná-la e, em seguida, clicar em “Responder” para confirmar sua resposta. Isso permite que os usuários participem de enquetes de maneira fácil e intuitiva, garantindo que suas respostas sejam registradas corretamente. Uma vez que a resposta é registrada, não pode ser alterada, garantindo a integridade da enquete.


##

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/resultadoEnquete.jpg">
</div>

Após encerrado o período de resolução da enquete, o usuário pode verificar o resultado. Esta tela oferece uma visão clara e compreensível dos resultados, onde é possível ver as informações detalhadas e a conclusão da enquete. A visualização do resultado inclui:

* Alternativa destaque: A alternativa que recebeu o maior número de respostas é destacada, permitindo ao usuário identificar rapidamente o resultado de maior preferência da enquete.
* Resultados individuais: Cada opção de resposta é exibida juntamente com a porcentagem e a quantidade total de respostas recebidas. 
* Total de respostas: O total geral de respostas recebidas em toda a enquete é exibido no final da tela, permitindo ao usuário identificar o público participante da enquete.

Em caso de múltiplas perguntas é possível navegar entre cada uma delas, clicando no seu número correspondente ao final da tela ou em “Próximo” / ”Anterior”, visualizando seus resultados e alternativas individualmente. Vale ressaltar que os resultados só podem ser visualizados após o encerramento da enquete, garantindo a justiça e a integridade do seu processo. 



## 🛠 Tecnologias

(A definir)

## 💻 Desenvolvedores

<div align="center">  
  <img align="center" width=10% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/simbolo%20nexustech%20colorida.png">
 </div>
 
<table>
  <tr>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/59273272?v=4" width="100px;" alt=""/><br /><sub><b> Amanda Lima </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/98599229?v=4" width="100px;" alt=""/><br /><sub><b> Antonio Vitor </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/142849685?v=4" width="100px;" alt=""/><br /><sub><b> Brenda Araújo </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/98289412?v=4" width="100px;" alt=""/><br /><sub><b> Fernanda Marinho </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/91295529?v=4" width="100px;" alt=""/><br /><sub><b> Gabriel Baptista </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/142272107?v=4" width="100px;" alt=""/><br /><sub><b> Gabriel Henry </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/143047526?v=4" width="100px;" alt=""/><br /><sub><b> Ilson Neto </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/89746639?v=4" width="100px;" alt=""/><br /><sub><b> José Gabriel </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/142133059?v=4" width="100px;" alt=""/><br /><sub><b> Luis Mario </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/89545660?v=4" width="100px;" alt=""/><br /><sub><b> Naylane Ribeiro </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/99758612?v=4" width="100px;" alt=""/><br /><sub><b> Pedro Mendes </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/143294885?v=4" width="100px;" alt=""/><br /><sub><b> Sara Souza </b></sub></a><br />👨‍💻</a></td>
    <td align="center"><img style="" src="https://avatars.githubusercontent.com/u/108939221?v=4" width="100px;" alt=""/><br /><sub><b> Thiago Sena </b></sub></a><br />👨‍💻</a></td>      
  </tr>
</table>



### Créditos

Este projeto é decorrente da disciplina EXA613 - MI de Engenharia de Software - Semestre: 2024.1 do Curso: Engenharia de Computação da Universidade Estadual de Feira de Santana - UEFS.

<div align="center">  
  <img align="center" width=40% src="https://github.com/brendatrindade/4vote-Readme/blob/main/imagens/nexustech%20principal.png">
 </div>

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=052A76&height=120&section=footer"/>

Cores: primaria - 052A76 secundaria - 02A6F4
