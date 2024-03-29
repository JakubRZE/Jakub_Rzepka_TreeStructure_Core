# Tree data structure management - web application.
ASP.NET MVC Core 2.2 / JQuery / AJAX / Dependency Injection / Azure
<br /><br />

Aplikacja pozwalająca użytkownikowi na zapisywanie danych oraz ich zarządzanie w strukturze drzewiastej.

- Struktura drzewiasta umożliwia działanie na dowolnej ilości poziomów.
- Funkcje dostępne dla użytkowników niezalogowanych: odczyt danych, rozwinięcia całej struktury lub wybranych węzłów, sortowanie.
- Funkcje dostępne po zalogowaniu: dodawanie, edycja, usuwania, sortowanie (zarówno węzłów jak i liści) z zapamiętaniem pozycji, 
  przenoszenie węzłów do innych gałęzi.
- Zabezpieczenia po stronie klienta, oraz serwera przed wprowadzeniem nieprawidłowych danych.

<br />
Aby dodać dziecko, edytować lub usunąć wybrany element, należy zaznaczyć go na liście poprzez kliknięcie (element stanie się żółty)<br />
(w celu odznaczenia klikamy ponownie na ten sam element).<br />
Przenoszenie elementów listy odbywa się za pomocą ikonki strzałek po prawej stronie, dostępnych po zaznaczeniu elementu.
Aby dodać kolejnego głównego rodzica należy mieć odznaczone wszystkie elementy(odznaczamy poprzez ponowne kliknięcie na element).
<br /><br />

Aplikacja znajduje się na serwerze Azure pod adresem:<br />
<b>https://jtreestructure.azurewebsites.net/</b>
<br /><br />

<b>Przykładowe dane do logowania:</b><br />
Login:  <b> admin@admin.com </b> <br />
Password:  <b> 123456</b> <br />

<br /><br />
Screenshot[1]: 

![tree1](https://user-images.githubusercontent.com/38703432/62670835-d583e500-b994-11e9-87e4-78df6caed909.png)

<br />
Screenshot[2]: 

![tree2](https://user-images.githubusercontent.com/38703432/62670187-9fddfc80-b992-11e9-9354-8c794f2aad67.png)
