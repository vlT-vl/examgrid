# Changelog

Le funzionalità principali dell'app, in ordine cronologico inverso.

## 2026-10-06

- Le card e i filtri di categoria ora riconoscono anche esami AWS, Debian, Ubuntu, Fedora, Kubernetes, OpenShift, Docker, Ansible, Google Cloud, Linux (generico), Cisco e Citrix, con l'icona del vendor corretta al posto del simbolo generico usato finora per queste categorie.

## 2026-10-05

- Le foto profilo non dipendono più da un link esterno a LinkedIn (che tra l'altro scadeva): ora arrivano già incorporate e cifrate nel registro utenti, quindi compaiono sempre — navbar, dettaglio esame, riepilogo e anche nel report HTML scaricato — senza alcun fetch a runtime verso servizi terzi.
- Corretto un difetto serio: se l'esame era in corso e la pagina veniva ricaricata per sbaglio (o il browser si chiudeva), l'intera prova andava persa senza alcun avviso. Ora il progresso (domande, risposte date, tempo trascorso e rimanente) viene salvato automaticamente e, dopo un ricaricamento accidentale, l'esame riprende esattamente da dove era rimasto; il browser chiede inoltre conferma prima di abbandonare la pagina mentre un esame è attivo.
- Corretto un difetto per cui i campi "Dalla domanda"/"Alla domanda" nella pagina di dettaglio esame potevano cambiare valore da soli se lo scroll del mouse/trackpad passava sopra il campo mentre questo aveva il focus (comportamento di default dei campi numerici nei browser), facendo partire l'esame su un intervallo di domande diverso da quello voluto senza che l'utente se ne accorgesse.
- Chi ha già un voucher non deve più aprire il pannello "Richiedi voucher" per inserirlo: nella pagina di dettaglio esame è comparso un campo dedicato, sempre visibile, con lo stesso stile del riquadro del codice di richiesta (stessa cornice, stesso font monospazio, pulsante centrato sotto il campo) — il pannello di richiesta resta a parte, ancora a scomparsa, per chi deve generarne uno nuovo.
- Corretto un difetto per cui, negli esami con molte domande, la tabella "Rivedi le risposte" del riepilogo diventava una lista lunghissima con scorrimento infinito, dando l'impressione che il report si fermasse a metà. Ora la tabella è paginata, 20 domande per pagina, con due frecce per spostarsi — stessa identica paginazione anche nel report HTML scaricabile, pienamente funzionante pure lì senza bisogno di riaprire l'app.
- Corretto il modale Info su mobile: i campi (versione, build, data, librerie) finivano impilati in modo disomogeneo (tre campi su due colonne lasciavano l'ultimo orfano a metà riga). Ora su schermi stretti sono un'unica colonna, un campo per riga con etichetta a sinistra e valore a destra, compatti e leggibili come nella versione desktop.
- L'icona Info nella navbar era nascosta su mobile (rimasta così da una sistemazione precedente della navbar): ora è di nuovo visibile a tutte le larghezze, come le altre icone della barra.
- Corretto un errore che impediva di tornare alla Home dopo aver avviato un esame (residuo della migrazione delle foto profilo di qualche modifica fa): il pulsante Home in navbar restava bloccato con un errore in console invece di funzionare.

## 2026-10-02

- Portale reso davvero fruibile su mobile: la navbar non si sovrapponeva più a se stessa su gran parte degli smartphone e la griglia esami poteva traboccare oltre il bordo dello schermo sui telefoni più piccoli — entrambi corretti.
- Il pulsante "Termina esame", durante lo svolgimento, ora porta sempre al riepilogo con l'esito e il punteggio calcolati sulle risposte date fino a quel momento, invece di scartare tutto e tornare al dettaglio esame.
- Schermata d'esame allargata ulteriormente sugli schermi grandi, con più respiro dal bordo superiore e anche in verticale (padding e righe delle risposte più ariose); stesso trattamento, più contenuto, per la pagina di dettaglio esame.
- La pillola "Termina esame" ora è un vero bottone (bordo e sfondo al passaggio del mouse), non più solo testo colorato.
- Corretto un difetto per cui, se il tempo scadeva mentre la domanda in corso non era ancora stata risposta per intero, l'esame non si chiudeva sul riepilogo come dovrebbe: ora, allo scadere del tempo, si passa sempre al report con l'esito calcolato sulle risposte date.
- Il popup di conferma di "Termina esame" non è più il dialogo grezzo del browser: ora è un modale in stile con il resto dell'app.
- Nella barra in alto durante l'esame, accanto al titolo sono comparse l'icona del vendor e una pillola col codice esame, stesso stile già usato nel report di riepilogo.
- Sistemato lo squilibrio visivo nella barra in alto durante l'esame: tempo rimanente e tempo trascorso ora hanno la stessa tipografia (prima uno era un numero grande in grassetto, l'altro testo piccolo grigio), e la pillola "Termina esame" ha un'icona X più in linea con lo stile dell'app.
- Corretto un difetto per cui, dopo l'introduzione della nuova schermata di apertura animata, il login a volte non compariva più e l'app restava bloccata su schermo vuoto.
- Rifinito lo sfondo di login e schermata di apertura: sfumatura diagonale verso il verde, chiaro/scuro per quasi tutta la larghezza e verde solo nell'ultimo tratto, senza elementi decorativi aggiuntivi.
- Corretto il selettore tema nel login: icona e testo erano scollegati tra loro (icona e scritta descrivevano cose diverse), ora sono coerenti.
- Rifatto lo sfondo di login e schermata di apertura sul modello dello sfondo di avvio di pmxtools: sfumatura diagonale scura/chiara con un velo verde concentrato in basso a destra.
- Nel popup Info è comparso il logo animato vlT sopra il copyright, cliccabile verso il sito dell'autore.
- Durante l'esame, il bottone "Avanti"/"Termina Esame" ora resta disattivato finché non si è risposto a tutte le domande richieste, invece di mostrare un messaggio d'errore dopo il click.
- Nella pagina di dettaglio esame è comparsa la foto del candidato (quando disponibile) accanto al nome, al posto della sola icona generica.
- Aggiornato il testo e l'aspetto dell'avviso prima di avviare l'esame: ora spiega che terminando in anticipo il risultato viene comunque calcolato sulle risposte date, con un'icona informativa e centrato.
- Tolta dal footer la riga "Costruito con React e Vite".
- Nella Home, su schermi larghi, la navbar, il footer e la colonna dei filtri per categoria restano ora sempre visibili: scorre solo la griglia degli esami, invece di tutta la pagina, senza mostrare una scrollbar invasiva.
- Aggiunto nella navbar lo storico personale delle prove concluse nella sessione corrente del browser: mostra in un modale tutti i dettagli di ogni sessione, permette di riaprire report e revisione risposte, esporta l'archivio completo in JSON e può ricaricarlo in seguito unendolo alle prove già presenti e a quelle nuove, sempre separato per utente.
- Rifinito il modale dello storico: più stretto e senza scorrimento orizzontale, ogni prova è organizzata come una scheda su due fasce da sei dati; il badge sulla navbar conta solo le sessioni nuove e scompare dopo aver aperto lo storico.
- Disabilitata la selezione accidentale del testo nell'intera interfaccia, lasciando selezionabili il codice di richiesta voucher e il campo del voucher completo.

## 2026-10-01

- Il riepilogo finale a fine esame ora entra in scena con un'animazione completa (non più statico): intestazione, dettagli, foto, esito e disclaimer compaiono in sequenza.
- Nelle card della Home e nel dettaglio esame è comparsa una pillola con la data dell'ultimo aggiornamento dei contenuti dell'esame, quando il registro la fornisce.
- Per chi è autorizzato, subito sotto al bottone "Scarica Report" (nel riepilogo e nel report HTML scaricabile) è comparsa una sezione a scomparsa "Rivedi le risposte", stessa animazione di apertura/chiusura della sezione voucher, con una tabella — ora con angoli arrotondati e righe più morbide — di ogni domanda, la risposta data e quella corretta.
- Allargata la Home: ora mostra almeno 4 card esame per riga sugli schermi larghi, stessa forma di prima, sempre centrata.
- Corretto un difetto per cui aprire sezioni lunghe (come "Rivedi le risposte") poteva far comparire la barra di scorrimento e spostare di scatto tutta l'interfaccia, navbar inclusa.
- Ogni domanda dell'esame indica ora sempre quante risposte vanno selezionate; dove ne basta una sola non è più possibile selezionarne di più, e in generale non si può mai superare il numero di risposte richiesto dalla domanda.
- Login ridisegnato: stesso selettore tema chiaro/scuro della navbar (prima uno slider diverso), sfondo con sfumatura dal bianco al verde chiaro, logo animato al posto di quello statico, testo di benvenuto coerente con una piattaforma di più esami (non più riferito a "iniziare l'esame").
- Il report HTML scaricato ora porta anche l'icona (favicon) di examgrid ed è autosufficiente anche su questo fronte, senza dipendere da file esterni.
- Login ulteriormente rifinito: card leggermente più larga, sfumatura di sfondo più marcata verso il verde (anche in tema scuro), interfaccia e bottoni con animazioni di ingresso/hover più curate, selettore tema ora una pillola con etichetta invece della sola icona.
- Aggiunto il logo reale S2E come icona di categoria (card Home e dettaglio esame) per gli esami di quella categoria. Corretta anche l'etichetta della categoria, prima "S2e" invece di "S2E".
- Sistemato lo sfondo del login: stessa identica sfumatura diagonale in entrambi i temi, solo bianco (chiaro) o nero (scuro) che sfuma verso lo stesso verde chiaro.
- Nelle card della Home e nel dettaglio esame è comparsa anche la lingua originale dell'esame, quando il registro la fornisce — resta sempre nella lingua in cui l'esame è stato scritto, indipendentemente dalla lingua scelta per l'interfaccia.
- Velocizzata l'animazione del logo examgrid (navbar e popup versione), stessa sequenza di prima ma più rapida.
- Badge esito (Promosso/Bocciato) nel riepilogo e nel report scaricato ridisegnato con un'icona vera al posto dell'emoji e un layout più ordinato.

## 2026-09-30

- Pagina di dettaglio esame e pagina di avvio unificate in un'unica card: dati dell'esame, richiesta voucher e — una volta sbloccato — le opzioni (intervallo domande, ordine casuale, mostra risposte corrette) stanno ora tutte nello stesso riquadro, invece di due schermate separate.
- Anche le opzioni "ordine casuale" e "intervallo domande" sono ora autorizzabili per singola utenza (come già la rivelazione delle risposte corrette), non più sempre disponibili a chiunque abbia un voucher valido.
- Allargate ulteriormente la schermata di dettaglio esame e quella dell'esame vero e proprio.
- Corretto un difetto per cui il bottone di chiusura del pannello voucher risultava con il bordo superiore tagliato.
- Le icone e i colori delle categorie ora seguono il logo e il colore del vendor reale (Red Hat, Nutanix, Proxmox, VMware) quando il registro lo fornisce, invece di un'icona generica.
- Icona Red Hat corretta nella variante richiesta (Font Awesome) al posto di quella inizialmente scelta (Simple Icons).
- Icona VMware corretta nella variante richiesta (Grommet Icons) al posto di quella inizialmente scelta (Simple Icons).
- Corretto un difetto per cui l'icona grande del vendor su card e dettaglio esame restava sempre verde: ora segue davvero il colore della categoria, come già faceva il tag testuale.
- Foto profilo dell'account (quando disponibile) mostrata in navbar e nel riepilogo/report finale, al posto dell'icona generica; chi non ne ha una vede l'icona come prima.
- Report finale riformattato in stile scheda ufficiale d'esame: intestazione centrata con icona e colore del vendor, nome esame e pillola col codice; sotto, i dettagli dell'esame affiancati dalla foto del candidato (quadrata, senza più la cornice grigia intorno, bordi arrotondati); in fondo alla card il logo esteso examgrid, come ultimo elemento del report (presente anche nel file HTML scaricato). Tolta una frase ridondante dai disclaimer, card complessivamente più compatta. Il bottone di download resta fuori dalla card, in fondo alla pagina. La foto nel file scaricato ora è incorporata direttamente (resta leggibile anche offline o dopo la scadenza del link originale).

## 2026-09-28

- Aggiunti due nuovi account mockup (`luca.spano`, `matteo.locascio`, password standard `meteor89`) accanto all'admin.
- Ogni account ha ora un elenco di esami a cui può accedere: la Home mostra solo gli esami consentiti per l'utenza loggata, l'amministratore continua a vederli tutti.
- Navbar, dettaglio esame e riepilogo mostrano ora il nome completo dell'utente al posto dello username tecnico.
- Aggiunto il deploy automatico su GitHub Pages: ogni push sul branch di sviluppo pubblica da solo la nuova versione del sito.
- Catalogo esami, contenuto delle domande ed elenco utenti ora arrivano dal vero registro remoto `examgrid.exams`, non più da dati locali di esempio.
- Aggiunto un sistema di voucher (come quello già in uso su nxget-app-portal): per avviare un esame serve un voucher a tempo, con durata decisa da chi lo emette — il nome del candidato si compila da solo dall'account con cui ha effettuato il login.
- Card degli esami in Home ingrandite e riorganizzate (icona, categoria, codice, titolo, descrizione, durata e numero di domande, tutto più leggibile), e aggiunta una barra di ricerca accanto al titolo per filtrare gli esami per nome, codice o categoria.
- Card ulteriormente ingrandite, e pagina di dettaglio esame riorganizzata con durata e numero di domande ben visibili.
- Gli elementi dentro le card e nella pagina di dettaglio esame ora entrano in sequenza, non solo il riquadro nel suo insieme. Allargato anche il popup delle informazioni di versione, dove alcuni testi andavano a capo in modo poco leggibile.
- Nella pagina di dettaglio esame, il pulsante "Avvia Esame" ora compare solo dopo aver inserito un voucher valido, invece di essere visibile ma disattivato.
- Il pannello voucher parte ora chiuso, come una piccola pillola da cliccare per aprirlo (stessa animazione già in uso su nxget-app-portal), invece di essere sempre visibile per intero.
- Schermata dell'esame ridisegnata: un unico riquadro centrale con intestazione (titolo, tempo rimanente/trascorso, uscita dall'esame) e piè di pagina (conteggio domande, Indietro/Avanti/Termina); le risposte ora sono righe intere con lettera (A, B, C…) invece di semplici caselle di spunta. Aggiunto un modo per uscire dall'esame in corso e tornare alla pagina di dettaglio, con conferma prima di perdere i progressi.
- Nuova pagina di avvio esame, prima di iniziare davvero: si può scegliere l'intervallo di domande, se mescolarle, e — solo per chi ne ha l'autorizzazione — se mostrare le risposte corrette durante lo svolgimento.
- Corretto un problema di layout per cui le risposte nella schermata d'esame risultavano tagliate sul bordo destro. Allargate la schermata d'esame e quella di avvio esame, prima troppo strette su schermi larghi.
- Un voucher ora sblocca solo l'esame specifico per cui è stato richiesto, non l'intero catalogo.
- La rivelazione delle risposte corrette (per chi ne ha l'autorizzazione) ora avviene domanda per domanda, con un pulsante a icona occhio, invece di restare sempre visibile per tutto l'esame.
- Riepilogo finale (e report HTML scaricabile) riformattato in stile scheda ufficiale: intestazione con logo examgrid e nome del candidato, elenco ordinato di tutti i dettagli dell'esame (candidato, esame, categoria, data, risposte corrette, tempo impiegato/rimanente, punteggio minimo/ottenuto) ed esito ben visibile in fondo.
- Corretta la dicitura della categoria VMware: ora "VMware-vSphere" con la capitalizzazione corretta del brand.
- Riepilogo finale allargato, con un modo per tornare alla Home e il pulsante "Scarica Report" spostato in alto a destra con la sua icona.
- Corretto un problema per cui il report scaricato risultava più stretto/diverso rispetto alla schermata finale nell'app. Riepilogo ulteriormente allargato e aggiunto un disclaimer in fondo (il report è una simulazione, non una certificazione ufficiale), come nei report ufficiali di certificazione.
- Nel report HTML scaricato la card ora resta centrata verticalmente e lo sfondo copre tutta la finestra, invece di restare ancorata in alto con uno sfondo che non arrivava in fondo alla pagina.

## 2026-09-25

- Progetto ripreso: documentazione riallineata alle convenzioni vlT (README, CHANGELOG, handoff) e dipendenze aggiornate alle versioni recenti.
- README ora in inglese, con il nuovo logo (`res/examgrid.svg`, anche come favicon) e una sezione Roadmap per l'evoluzione in corso.
- Licenza proprietaria (Proprietary Source-Available), la stessa del portale nxget adattata a examgrid, al posto della vecchia licenza MIT.
- Rimossa la vecchia decrittazione AES-CBC/PBKDF2 dei file esame (e il relativo campo token in home): i file esame sono ora letti in chiaro, in attesa di un nuovo metodo per oscurarli.
- Aggiunta una pagina di login a schermo intero davanti all'app (per ora un solo account placeholder, `admin`/`admin`), in stile chiaro/scuro coerente col resto dell'app, tonalità bianco/grigio con accenti verde chiaro.
- Login: aggiunto il selettore tema chiaro/scuro (prima disponibile solo dopo il login) e l'icona ora cambia colore in base al tema dell'app, non più in base al sistema operativo.
- Sostituita la vecchia schermata statica "Importa Esame" con una vera Home: navbar in alto (logo, info, utente loggato, logout) e una griglia di card, una per esame disponibile nel catalogo.
- Aggiunta una pagina di dettaglio per esame (icona, codice, descrizione) da cui inserire il nome candidato e avviare l'esame — icona/codice/descrizione sono per ora campi mockup, in attesa che il catalogo remoto li esponga davvero.
- Le card degli esami ora hanno anche una categoria (tag), e nella Home è comparso un filtro per categoria sopra la griglia.
- Nuovo footer, in stile nxget-app-portal: logo/brand, tag con versione ed elenco delle tecnologie usate. Il popup con le informazioni di versione è stato ridisegnato nello stesso stile del popup di nxget, e si apre sia dalla navbar sia dal tag versione nel footer.
- Il nome del candidato non si inserisce più a mano nella pagina di dettaglio esame: viene preso automaticamente da chi ha effettuato il login.
- Il footer resta ora ancorato in fondo alla pagina quando il contenuto è corto, invece di seguire subito il contenuto. Sistemato un problema per cui il timer dell'esame non aveva un vero layout ad affiancamento. Rivista la resa su schermi piccoli di navbar, pagina esame, riepilogo e dettaglio esame.
- Footer semplificato: tolta la tagline, ora mostra al centro il copyright vlT insieme al tag di versione.
- Logo di examgrid centrato nella navbar.
- Interfaccia bilingue italiano/inglese, con selettore lingua nella navbar e nella pagina di login — nessun testo dell'interfaccia resta più fisso in una sola lingua, report scaricabile incluso.
- Il login resta attivo dopo un ricaricamento della pagina: si torna alla Home, non più al modulo di accesso.
- Home: aggiunto il selettore tema chiaro/scuro (prima disponibile solo nel login) e i filtri per categoria sono passati in una colonna a sinistra della griglia esami, impilata sopra su schermi stretti.
- Selettore tema spostato nella navbar (icona sole/luna, stesso stile di nxget-app-portal), tolto dalla Home. Filtri categoria tornati a pillole orizzontali sopra la griglia, ognuna con un'icona a sinistra del testo. Area esami allargata, fino a 5 card per riga su schermi larghi.
- Riorganizzazione interna: cartella `lib/` eliminata, la logica di decorazione degli esami è ora in `App.jsx` e i dati mockup (categoria/icona) sono in un file JSON dedicato sotto `data/`.
- Tolto il caricamento del catalogo dal vecchio repo GitHub pubblico: per ora gli esami vengono solo dal manifest mockup locale (`src/data/exam.json`), in attesa del futuro registro `examgrid.tools`.
- Il file `data/exam.json` è ora un vero manifest per l'intero catalogo (id, codice, titolo, categoria, icona, durata, numero di domande, descrizione in italiano e inglese) invece di pochi campi sparsi — pensato per diventare la stessa struttura di una futura API REST.
- Home animata all'apertura (titolo, filtro categorie, card in sequenza) e navbar con logo ingrandito, entrambi con una piccola animazione di ingresso.
- Filtro categorie tornato in colonna a sinistra della griglia esami (impilato sopra su schermi stretti).
- Ogni categoria ha ora una propria sfumatura di verde, applicata sia alle pillole del filtro sia al tag categoria sulle card e nel dettaglio esame.
- Logo examgrid ingrandito anche nel popup delle informazioni di versione.
- Tolta l'animazione di rotazione/rimbalzo dal logo in navbar (fuori tono per uno strumento professionale). Pillole del filtro categoria: tolta la larghezza forzata, ora dimensionate su icona+testo invece di riempire tutta la colonna.
- Nuovo logo animato solo per la navbar: l'icona si disegna una riga alla volta, poi la scritta "examgrid" entra una lettera alla volta.
- Corretta l'icona utente in navbar: dimensione e allineamento verticale rispetto al nome utente sbagliati, ora sistemati.
- Le credenziali di accesso non sono più fisse nel codice: vengono lette da un elenco utenti mockup (`data/users.json`), stesso trattamento del catalogo esami, in attesa dell'elenco cifrato che arriverà da examgrid.tools.
- Il logo animato ora compare anche nel popup delle informazioni di versione (prima solo icona statica), in versione più grande.
- Riorganizzazione interna: tutti i fogli di stile ora sotto `src/css/`. Ripulite alcune classi CSS rimaste senza uso (checkbox/testo risposta di una vecchia versione del componente domanda).
