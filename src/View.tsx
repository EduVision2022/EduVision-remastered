// @ts-nocheck
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useId } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import dayjs, { locale } from "dayjs";
import "dayjs/locale/ro";

// User interface for the component
import { selectShouldUpdate, setUser, selectUser } from "./userSlice";

// Component imports
import Delayed from "./Delayed.tsx";

// Mantine imports
import { Accordion, AccordionProps, createStyles, Grid } from "@mantine/core";
import { Paper } from "@mantine/core";
import { Center } from "@mantine/core";
import { Code } from "@mantine/core";
import { Text } from "@mantine/core";
import { Space } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { Calendar, RangeCalendar } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import { Transition, GroupedTransition } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Modal } from "@mantine/core";
import { Title } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { Button } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Badge } from "@mantine/core";
import { Stack } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { Group } from "@mantine/core";
import { Container } from "@mantine/core";
import { RadioGroup, Radio } from "@mantine/core";
import { ScrollArea } from "@mantine/core";
import { useMantineColorScheme, useMantineTheme } from "@mantine/core";

//Font import
import "./smallestPixel.css";

// Icons imports
import { FileDatabase, Plus } from "tabler-icons-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Help } from "tabler-icons-react";
import { LayoutList } from "tabler-icons-react";
import { CalendarEvent } from "tabler-icons-react";
import { Check, X } from "tabler-icons-react";

// Image imports
import backgroundLight from "./images/defaultLight.png";
import backgroundDark from "./images/defaultDark.png";
import backgroundLightInverted from "./images/invertedLight.png";
import backgroundDarkInverted from "./images/invertedDark.png";

// Firestore firebase imports
import {
  getFirestore,
  query,
  collection,
  where,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { addDoc, getDocs } from "firebase/firestore";
import { logout, db } from "./firebase";
import { userInfo } from "os";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, SignInWithGoogle } from "./firebase";
import { showNotification } from "@mantine/notifications";

// Providers
import { usePointsContext } from "./points.tsx";

const useStyles = createStyles((theme, _params, getRef) => ({
  icon: { ref: getRef("icon") },

  control: {
    ref: getRef("control"),
    border: 0,
    opacity: 0.6,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    "&:hover": {
      backgroundColor: "transparent",
      opacity: 1,
    },
  },

  item: {
    borderBottom: 0,
    overflow: "hidden",
    transition: `box-shadow 150ms ${theme.transitionTimingFunction}`,
    border: "1px solid transparent",
    borderRadius: theme.radius.sm,
  },

  itemOpened: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[3],

    [`& .${getRef("control")}`]: {
      opacity: 1,
    },

    [`& .${getRef("icon")}`]: {
      transform: "rotate(45deg)",
    },
  },

  content: {
    paddingLeft: 0,
  },
}));

function StyledAccordion(props: AccordionProps) {
  const { classes } = useStyles();
  return <Accordion classNames={classes} {...props} />;
}

function sortByDate(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const View = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [user, loading, error] = useAuthState(auth);

  const shouldUpdate = useSelector(selectShouldUpdate);

  const [pointsProvider, setPointsProvider] = usePointsContext();

  const Location = useLocation();
  const orar = Location.state.orar;

  const date = orar.date;

  const [testModal, setTestModal] = useState(false);
  const [pasTest, setPasTest] = useState(0);
  const [score, setScore] = useState(0);

  console.log(orar);

  const [windowDimension, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  const [segValue, setSegValue] = useState("react");

  const [value, setValue] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [currDate, setCurrDate] = useState(0);

  const [intrebare, setIntrebare] = useState("");
  const [anonim, setAnonim] = useState(false);

  const [testMaterie, setTestMaterie] = useState("");
  const [testCapitol, setTestCapitol] = useState("");

  function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }
  const setFormatDDMMYYYYtoMMDDYYYY = (date, separator = "/") => {
    const [day, month, year] = date.split("/");
    return month + separator + day + separator + year;
  };
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  dayjs.locale("ro");

  function intrebareMaterie(
    materie,
    capitol,
    intrebare,
    raspunsuri = [],
    raspunsCorect
  ) {
    this.materie = materie;
    this.capitol = capitol;
    this.intrebare = intrebare;
    this.raspunsuri = raspunsuri;
    this.raspunsCorect = raspunsCorect;
  }

  var intrebariMain = [
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Valoarea expresiei C/C++: 12*2+2 este:",
      ["48", "28", "26", "24"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Valoarea expresiei C/C++: 78*4+2%1 este:",
      ["312", "302", "322", "292"],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Valoarea expresiei C/C++: 42/10*29/10 este:",
      ["10", "15", "11", "9"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Valoarea expresiei C/C++: 98%6+4%4 este:",
      ["5", "1", "3", "2"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Variabilele x și y sunt întregi. Indicați expresia C/C++ echivalentă cu (x<3)&&(y>=5).",
      [
        "!(!(x<3)||!(y>=5))",
        "!(x>=3)&&(y<5)",
        "!((x>=3)&&(y<5))",
        "!((x<3)||(y>=5))",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Declararea variabilelor",
      "Ce memoreaza tipurile float si double?",
      ["Numere reale", "Nimic", "Caractere", "Adevarat sau fals"],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Declararea variabilelor",
      "Alegeți declararea corectă a unei variabile structurale cu 2 componente, una de tip real și una de tip întreg.",

      [
        "int float x[10] ;",
        "struct { float x; int y} a;",
        "float a[20];",
        "struct { float x; int y} int a;",
      ],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Declararea variabilelor",
      "Alegeți declararea corectă a unui tablou unidimensional de tip real.",
      ["int a[100];", "float a[100];", "int a = [100];", "float a = [100];"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Care este numarul maxim de componente conexe pe care le poate avea un graf neorientat cu 20 de noduri, 12 muchii?",
      ["6", "12", "10", "15"],
      4
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Cate grafuri neorientate distincte cu 4 varfuri se pot construi?",
      ["4^6", "2^6", "6^4", "4"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Care este suma gradelor varfurilor unui graf neorientat cu n varfuri si m muchii?",
      ["2*m", "2*n", "2*(m-1)", "2"],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Care dintre urmatoarele este falsa?",
      [
        "Matricea de adiacenta a unui graf neorientat este simetrica fata de diagonala principala",
        "Matricea de adiacenta a unui graf neorientat are numar impart de valori nenule",
        "Din matricea de adiacenta a unui graf neorientat se poate afla gradul unui nod",
        "Din matricea de adiacenta a unui graf neorientat se poate afla numarul de muchii",
      ],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Intr-un graf neorientat suma valorilor din matricea de adiacenta este m. Atunci numarul de muchii ale grafului este:",
      ["m", "m/2", "2m", "m-1"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "Care dintre urmatoarele este forma structurii repetitive cu numar necunoscut de pasi, cu test final?",
      ["for", "while", "do-while", "foreach"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "Ce se afisează, în urma executării următoarelor instrucțiuni: int b[5]={88,87,76,36,21},i;for( i=1;i<4;i++){cout<<b[i]<<' ';}",
      [
        "87 76 36",
        "88 87 76 36 21",
        "87 76 36 21",
        "Secventa are erori de sintaxa.",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "De cate ori va primi valorea 0 variabila 'ok' pentru n = 12? Secventa de cod: ok = 1; for(d = 2; d <= n; d++) {if(n % d == 0) ok = 0;}",
      ["6 ori", "2 ori", "4 ori", "o singura data"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "Care este rezultatul urmatoarei secvente de cod? s = 0; for(d = 1; d <= n; d++) {if(n % d == 0) s += d;}",
      [
        "Numara in variabila 's' cati divizori are 'n'",
        "In variabila 's' se va calcula suma numerelor de la 1 la 'n'",
        "Determina daca n este prim sau nu",
        "Calculeaza in 's' suma tuturor divizorilor lui 'n'",
      ],
      4
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "Care dintre urmatoarele enumerate reprezinta structuri de date repetitive?",
      ["if-else", "for", "switch", "daca"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Matrici",
      "Matricea patratica e o matrice de ordinul",
      ["1 x n", "n x 1", "n x n", "n x m"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Matrici",
      "Fie doua matrici patratice 'a' si 'b'. E posibila egalitatea a * b = b * a?",
      ["Da", "Nu", "Nu se poate stabili", "Doar in anumite conditii"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Matrici",
      "Matricea coloana este o matrice de ordinul",
      ["1 x n", "n x 1", "n x n", "n x m"],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Matrici",
      "Matricea linie e o matrice de ordinul",
      ["1 x n", "n x 1", "n x n", "n x m"],
      1
    ),
    new intrebareMaterie(
      "Matematică",
      "Geometrie",
      "Ecuatia dreptei care trece prin punctele M(1,2) si N(2,5)  este:",
      ["2x + y = 2", "x = 0", "y = 3", "3x - y = 1"],
      4
    ),
    new intrebareMaterie(
      "Matematică",
      "Geometrie",
      "Sa se determine coordonatele mijlocului segmentului AB, unde A(-3,4) si B(7,-2)",
      ["(2,1)", "(1,2)", "(7,-2)", "(-3,4)"],
      1
    ),
    new intrebareMaterie(
      "Matematică",
      "Geometrie",
      "Aria cercului de diametru 2 este:",
      ["3π", "π;", "6π;", "4π;"],
      2
    ),
    new intrebareMaterie(
      "Matematică",
      "Geometrie",
      "Daca x ≤ 3 - 2x atunci:",
      ["x ≤ -5 ", "x = 0 ", "x ≤ -11", "x ≤ 1 "],
      4
    ),
    new intrebareMaterie(
      "Matematică",
      "Geometrie",
      "Solutia ecuatiei 5x-12=3x este:",
      ["-5", "6", "4", "5"],
      2
    ),
    new intrebareMaterie(
      "Română",
      "Literatură",
      'Cine este purtătorul mesajului moralizator al nuvelei "Moara cu Noroc" ',
      ["Lică Sămădăul", "Soacra lui Ghiță", "Ghiță", "Ana"],
      2
    ),
    new intrebareMaterie(
      "Română",
      "Literatură",
      'Ce tip de opera este "Povestea lui Harap-Alb"?',
      ["Basm", "Nuvelă", "Roman", "Comedie"],
      1
    ),
    new intrebareMaterie(
      "Română",
      "Literatură",
      "Cine a scris Floare Albastra?",
      ["Ion Creanga", "Ioan Slavici", "Mihai Eminescu", "Ion Pillat"],
      3
    ),
    new intrebareMaterie(
      "Română",
      "Literatură",
      'Cine a scris "Povestea lui Harap-Alb"?',
      ["Ioan Slavici", "Ion Creanga", "Mihai Eminescu", "Ion Luca Caragiale"],
      2
    ),
    new intrebareMaterie(
      "Fizică",
      "Mecanică",
      "O macara ridică un corp de masă m pe distanța H, pe direcție verticală, și ulterior îl deplasează orizontal, pe distanța D. Expresia matematică a lucrului mecanic efectuat de greutatea corpului este:",
      ["L = m*g*(D-H)", "L = m*g*(D+H)", "L = m*g*h", "L = -m*g*h"],
      4
    ),
    new intrebareMaterie(
      "Fizică",
      "Mecanică",
      "Un fir elastic omogen are constanta elastică k = 600 N/m. Se taie din fir o bucată de lungime egală cu un sfert din lungimea totală a firului nedeformat. Constanta elastică a acestei bucăți de fir are valoarea:",
      ["2400 N/m", "800 N/m", "450 N/m", "150 N/m"],
      1
    ),
    new intrebareMaterie(
      "Fizică",
      "Mecanică",
      "Un corp este aruncat de la nivelul solului, cu viteza inițială v0 = 30 m/s, vertical în sus. În absența frecării cu aerul, corpul urcă față de punctul de lansare la înălțimea maximă de:",
      ["300 m", "45 m", "3 m", "15 m"],
      2
    ),
    new intrebareMaterie(
      "Fizică",
      "Mecanică",
      "Proprietatea unui corp numită inerție este descrisă cantitativ de mărimea fizică numită:",
      ["greutate", "masă", "forta", "acceleratie"],
      2
    ),
    new intrebareMaterie(
      "Fizică",
      "Mecanică",
      "Asupra unui resort elastic acționează la ambele extremități, în sensuri contrare, câte o forță având modulul egal cu 30N. Alungirea resortului este egală cu 5cm. Constanta elastică a resortului este egală cu:",
      ["1200 N/m", "600 N/m", "150 N/m", "6 N/m"],
      2
    ),
    new intrebareMaterie(
      "Fizică",
      "Termodinamică",
      "Energia internă a unui gaz ideal scade atunci când gazul este supus următorului proces termodinamic:",
      [
        "Comprimare adiabatica",
        "Destindere la presiune constanta",
        "Comprimare la presiune constanta",
        "Destindere la temperatura constanta",
      ],
      3
    ),
    new intrebareMaterie(
      "Fizică",
      "Termodinamică",
      "O cantitate ν = 4 moli de gaz ideal diatomic (C R V = 2,5 )), aflat la temperatura T1 = 300 K, este încălzit adiabatic până la temperatura T2 = 600 K. Lucrul mecanic efectuat de gaz este de aproximativ:",
      ["-30,5 kJ", "-24,9 kJ", "24,9 kJ", "30,5 kJ"],
      2
    ),
    new intrebareMaterie(
      "Fizică",
      "Termodinamică",
      "Unitatea de măsură a raportului dintre capacitatea calorică a unei bile de fier și căldura specifică a fierului este:",
      ["J/K", "kg/mol", "kg", "mol"],
      3
    ),
    new intrebareMaterie(
      "Fizică",
      "Termodinamică",
      "Considerând că simbolurile mărimilor fizice și convențiile de semne pentru căldură și lucru mecanic sunt cele utilizate în manualele de fizică, expresia corectă a principiului I al termodinamicii este:",
      ["U = Q + L", "ΔU = Q + L", "ΔU = Q - L", "U = Q - L"],
      3
    ),
    new intrebareMaterie(
      "Fizică",
      "Termodinamică",
      "Într-o destindere adiabatică a unei mase constante de gaz ideal, densitatea acestuia:",
      ["crește", "scade", "rămâne constantă", "crește și apoi scade"],
      2
    ),
    new intrebareMaterie(
      "Chimie",
      "Hidrocarburi",
      "Simetria orbitalilor sp3 este:",
      ["cilindrica", "trigonala", "tetraedica", "planara"],
      3
    ),
    new intrebareMaterie(
      "Chimie",
      "Hidrocarburi",
      "2-Pentena",
      [
        "Poate avea doi izomeri geometrici",
        "Nu este izomera de pozitie cu 1-pentena",
        "Nu se oxideaza cu bicromat de potasiu in prezenta acidului sulfuric",
        "Se nitreaza cu amestec sulfonitric",
      ],
      1
    ),
    new intrebareMaterie(
      "Chimie",
      "Hidrocarburi",
      "O alchenă şi un cicloalcan cu catena liniară cu acelaşi număr de atomi de carbon au:",
      [
        "Acelasi punct de topire",
        "Acelasi indice de refractie",
        "Aceeasi formula moleculara",
        "Aceeasi stare de agregare",
      ],
      3
    ),
    new intrebareMaterie(
      "Chimie",
      "Hidrocarburi",
      "Pentru un aminoacid nu se poate spune că:",
      [
        "Este natural dacă este alifatic şi este un α−aminoacid",
        "Este un aminoacid esenŃial dacă poate fi produs de organismul uman",
        "Este acidul asparagic dacă este acidul α-aminosuccinic",
        "Are un caracter de amfiion",
      ],
      2
    ),
    new intrebareMaterie(
      "Chimie",
      "Hidrocarburi",
      "Următoarea reactia nu este o reactie de halogenare:",
      [
        "Aditia bromului la 2-pentenă",
        "Reactia toluenului cu clorura de acetil",
        "Bromurarea fotochimică a metanului",
        "Reactia dintre alcoolul tert-butilic şi acidul clorhidric.",
      ],
      2
    ),
    new intrebareMaterie(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Atriul stang comunica cu ventricului stang printr-un orificiu prevaut cu valva/valvula:",
      ["Semilunara", "Bicuspida", "Sigmoida", "Tricuspida"],
      2
    ),
    new intrebareMaterie(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Substanța aflată în plasmă care are rol în coagulare este:",
      ["Fibrinogenul", "Colesterolul", "Glucoza", "Toate substanele enumerate"],
      1
    ),
    new intrebareMaterie(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Ce orificiu se află între esofag și stomac?",
      ["Pilor", "Cardia", "Sfincter", "Nu se află niciun orificiu"],
      2
    ),
    new intrebareMaterie(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Alegeți afirmația adevărată referitoare la schimbul de gaze:",
      [
        "Este un proces activ",
        "O2 trece din sange in alveola",
        "CO2 trece din alveola in sange",
        "Se realizeaza prin difuziune",
      ],
      4
    ),
    new intrebareMaterie(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Sunt căi urinare intrarenale:",
      ["Ureterele", "Tubii colectori", "Vezica urinara", "Uretra"],
      2
    ),
  ];

  var intrebariInformatica = [
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Indicați expresia C/C++ cu valoarea 0",
      ["sqrt(16)==4", "45*5==200+5*5", "25/10==15/10", "64/4==8*2"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Numim pădure un graf neorientat în care fiecare componentă conexă a sa este un arbore. Orice pădure cu cel putin doi arbori este un graf care:",
      [
        "Are cicluri şi este conex",
        "Are cicluri şi nu este conex",
        "Nu are cicluri şi este conex",
        "Nu are cicluri şi nu este conex",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Declararea variabilelor",
      "Alegeți declararea corectă a unei variabile structurale cu 2 componente, una de tip real și una de tip întreg.",

      [
        "int float x[10] ;",
        "struct { float x; int y} a;",
        "float a[20];",
        "struct { float x; int y} int a;",
      ],
      2
    ),
    new intrebareMaterie(
      "Informatică",
      "Expresii",
      "Variabilele x și y sunt întregi. Indicați expresia C/C++ echivalentă cu (x<3)&&(y>=5).",
      [
        "!(!(x<3)||!(y>=5))",
        "!(x>=3)&&(y<5)",
        "!((x>=3)&&(y<5))",
        "!((x<3)||(y>=5))",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Grafuri",
      "Valorile care pot reprezenta gradele nodurilor unui graf neorientat, cu 6 noduri, sunt:",
      ["2,2,5,5,0,1", "6,5,4,3,2,1", "2,2,3,4,0,3", "1,0,0,2,2,2"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Structuri repetitive",
      "Ce se afisează, în urma executării următoarelor instrucțiuni: int b[5]={88,87,76,36,21},i;for( i=1;i<4;i++){cout<<b[i]<<' ';}",
      [
        "87 76 36",
        "88 87 76 36 21",
        "87 76 36 21",
        "Secventa are erori de sintaxa.",
      ],
      1
    ),
    new intrebareMaterie(
      "Informatică",
      "Matrici",
      "Variabilele i şi j sunt de tip întreg, iar variabila m memorează un tablou bidimensional cu 5 linii şi 5 coloane, numerotate de la 0 la 4, cu elemente numere întregi. O expresie C/C++ a cărei valoare este egală cu produsul dintre primul element de pe linia i și ultimul element de pe coloana j din acest tablou este:",
      ["m(0,i)*m(j,4)", "m(i)(0)*m(4)(j)", "m[i][0]*m[4][j]", "m[0,i]*m[j,4]"],
      3
    ),
    new intrebareMaterie(
      "Informatică",
      "Backtracking",
      "Utilizând metoda backtracking se generează toate modalităţile de a scrie numărul 6 ca sumă de numere naturale impare. Termenii fiecărei sume sunt în ordine crescătoare. Cele patru soluţii sunt obţinute în această ordine: 1+1+1+1+1+1; 1+1+1+3; 1+5; 3+3. Aplicând acelaşi algoritm, numărul soluţiilor obţinute pentru scrierea lui 8 este:",
      ["9", "6", "5", "8"],
      2
    ),
  ];

  const UserObject = useSelector(selectUser);

  const [currIntrebari, setCurrIntrebari] = useState([]);
  const generateIntrebari = async (materie, capitol) => {
    var intrebari = [];

    for (var i = 0; i < intrebariMain.length; i++) {
      if (intrebariMain[i].materie == materie) {
        if (intrebariMain[i].capitol == capitol) {
          intrebari.push(intrebariMain[i]);
        }
      }
    }
    console.log("intrebari: ", intrebari);
    await setCurrIntrebari(intrebari);
  };

  const manageTest = async (date = currDate) => {
    setPasTest(0);
    setTestMaterie(orar.materii[orar.date.indexOf(date)]);
    setTestCapitol(orar.capitole[orar.date.indexOf(date)]);
    setTestModal(true);
  };

  class Intrebare {
    intrebare: string;
    materie: string;
    capitol: string;
    username: string;
    constructor(intrebare, materie, capitol, username) {
      this.intrebare = intrebare;
      this.materie = materie;
      this.capitol = capitol;
      this.username = username;
    }
  }

  const addQuestion = async (intrebare, materie, capitol, username) => {
    var question = new Intrebare(intrebare, materie, capitol, username);
    const q = query(
      collection(db, "intrebari"),
      where("intrebare", "==", question.intrebare)
    );
    const aux = await getDocs(q);
    const document = aux.docs[0];
    console.log(document);
    if (aux.docs.length === 0) {
      await addDoc(collection(db, "intrebari"), {
        intrebare: intrebare,
        materie: materie,
        capitol: capitol,
        raspuns: [],
        autor: username,
      });
    }
  };

  const [completate, setCompletate] = useState([]);

  const [shouldFetch, setShouldFetch] = useState(0);

  const fetchCompletate = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    const orare = document.data().orare;
    orare.forEach((element, index) => {
      if (element.nume == orar.nume) {
        setCompletate(orare[index].completate);
      }
    });
  };

  useEffect(() => {
    fetchCompletate();
  }, []);

  const checkScore = async (date = currDate) => {
    if (score >= currIntrebari.length / 2) {
      addPoints(50);
      setPointsProvider(true);
      setShouldFetch((value) => value + 1);
      const activity = {
        name: "Completare",
        description:
          "Ai completat o ora nouă de " + currIntrebari[0].materie + "!",
        price: 0,
        date: new Date(),
      };

      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const aux = await getDocs(q);
      const document = aux.docs[0];
      const orare = document.data().orare;
      orare.forEach((element, index) => {
        if (element.nume == orar.nume) {
          orare[index].completate[orar.date.indexOf(date)] = true;
        }
      });
      await setDoc(
        doc(db, "users", document.id),
        {
          orare: orare,
          recentActivities: [...document.data().recentActivities, activity],
        },
        { merge: true }
      );

      showNotification({
        title: "Ai completat ora cu succes!",
        message: "Ai primit 50 puncte!",
        autoClose: 2000,
        color: "green",
        icon: <Check />,
      });
      fetchCompletate();
    } else {
      showNotification({
        title: "Nu ai completat ora!",
        message:
          "Ai greșit prea multe răspunsuri, mai încearcă după ce te pregătești!",
        autoClose: 2000,
        color: "red",
        icon: <X />,
      });
    }
    console.log(score);
    setScore(0);
  };

  const addPoints = async (points) => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const aux = await getDocs(q);
    const document = aux.docs[0];
    await setDoc(
      doc(db, "users", document.id),
      {
        puncte: document.data().puncte + points,
        maxPoints: document.data().maxPoints + points,
      },
      { merge: true }
    );
  };

  function AccordionLabel({ date, important, completat }) {
    var data = dayjs(setFormatDDMMYYYYtoMMDDYYYY(date)).format(
      "dddd, D MMMM, YYYY"
    );
    return (
      <>
        <div className="accordion-label" style={{ display: "inline-block" }}>
          <Text style={{ display: "inline-block" }}>
            {dayjs(setFormatDDMMYYYYtoMMDDYYYY(date)).format(
              "dddd, D MMMM, YYYY"
            )}
          </Text>
          <Group position="right" style={{ display: "inline-block" }}>
            <Container>
              {important ? (
                <Badge color="teal" size="md">
                  Important
                </Badge>
              ) : null}
              {completat ? (
                <Badge color="green" size="md" style={{ marginLeft: "0.5rem" }}>
                  COMPLETAT
                </Badge>
              ) : null}
            </Container>
          </Group>{" "}
        </div>
      </>
    );
  }
  return (
    <div className="view" style={{}}>
      <Center>
        <Tabs grow style={{ marginTop: "3rem" }} variant="pills">
          <Tabs.Tab label="Lista" icon={<LayoutList size={14} />}>
            <Paper
              shadow="xl"
              radius="md"
              p="xl"
              withBorder
              style={{
                width: windowDimension.winWidth > 720 ? "35rem" : "auto",
              }}
            >
              <StyledAccordion iconPosition="left" multiple>
                {date.map((date, index) => (
                  <Accordion.Item
                    label={
                      <AccordionLabel
                        date={date}
                        important={orar.importante[index]}
                        completat={completate[orar.date.indexOf(date)]}
                      />
                    }
                    style={{
                      alignContent: "left",
                      alignItems: "left",
                      textAlign: "left",
                      marginTop: "1rem",
                    }}
                  >
                    {
                      <div className="accordion-content">
                        <Stack spacing="xs" style={{ marginLeft: "1rem" }}>
                          <div className="materie">
                            <Text weight="bold" size="sm">
                              Materia
                            </Text>
                            <Center
                              style={{
                                alignContent: "left",

                                float: "left",
                              }}
                            >
                              <Paper p="xs" radius="md" withBorder>
                                <Text
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="sm"
                                  weight={500}
                                >
                                  {orar.materii[index]}
                                </Text>
                              </Paper>
                            </Center>
                          </div>
                          <div className="capitol">
                            <Text weight="bold" size="sm">
                              Capitol
                            </Text>
                            <Center
                              style={{
                                alignContent: "left",
                                float: "left",
                              }}
                            >
                              <Paper p="xs" radius="md" withBorder>
                                <Text
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="sm"
                                  weight={500}
                                >
                                  {orar.capitole[index]}
                                </Text>
                              </Paper>
                            </Center>
                          </div>
                          <div className="ora">
                            <Text weight="bold" size="sm">
                              Ora
                            </Text>
                            <Center
                              style={{
                                alignContent: "left",
                                float: "left",
                              }}
                            >
                              <Paper p="xs" radius="md" withBorder>
                                <Text
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="sm"
                                  weight={500}
                                >
                                  {orar.ore[index]}
                                </Text>
                              </Paper>
                            </Center>
                          </div>
                          <div className="durata">
                            <Text weight="bold" size="sm">
                              Durata
                            </Text>
                            <Center
                              style={{
                                alignContent: "left",
                                float: "left",
                              }}
                            >
                              <Paper p="xs" radius="md" withBorder>
                                <Text
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="sm"
                                  weight={500}
                                >
                                  {orar.durata[index]}
                                </Text>
                              </Paper>
                            </Center>
                          </div>
                        </Stack>
                        <br />
                        <Paper shadow="xl" radius="md" p="md" withBorder>
                          <Text weight="600" size="sm">
                            Pune o întrebare despre ora aceasta
                          </Text>
                          <Text weight="600" size="xs" color="dimmed">
                            Întrebarea va fi publicată la secțiunea
                            <Badge color="gray">Întrebări</Badge> și orice
                            utliziator îți va putea răspunde.
                          </Text>
                          <Checkbox
                            label={"Doresc să rămân anonim"}
                            style={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                            checked={anonim}
                            onChange={(event) =>
                              setAnonim(event.currentTarget.checked)
                            }
                          />
                          <TextInput
                            variant="default"
                            placeholder="Intrebare"
                            value={intrebare}
                            onChange={(event) =>
                              setIntrebare(event.currentTarget.value)
                            }
                            style={{
                              display: "inline-block",
                              width: "75%",
                              marginRight: "0.5rem",
                            }}
                          />
                          <Button
                            variant="default"
                            style={{ display: "inline-block" }}
                            onClick={() => {
                              addQuestion(
                                intrebare,
                                orar.materii[index],
                                orar.capitole[index],
                                anonim == true ? "Anonim" : user.displayName
                              );
                              addPoints(25);
                              setPointsProvider(true);
                              showNotification({
                                title: "Întrebarea a fost adăugată!",
                                message: "Ai primit 25 puncte!",
                                autoClose: 2000,
                                color: "green",
                                icon: <Check />,
                              });
                            }}
                          >
                            Intreaba
                          </Button>
                        </Paper>
                        <Paper
                          shadow="xl"
                          radius="md"
                          p="md"
                          withBorder
                          style={{ marginTop: "1rem" }}
                        >
                          <Text weight="600" size="sm">
                            Completează ora
                          </Text>
                          <Text weight="600" size="xs" color="dimmed">
                            {completate[orar.date.indexOf(date)] ? (
                              <Text weight="600" size="md" color="green">
                                Ora a fost completată
                              </Text>
                            ) : (
                              <>
                                Pentru a completa ora, trebuie sa raspunzi
                                corect la cel puțin jumătate <br />
                                din întrebările care îți vor fi puse. Când ești
                                pregătit, apasă butonul{" "}
                                <Text
                                  weight="600"
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="xs"
                                  style={{ display: "inline-block" }}
                                >
                                  {" "}
                                  Afișează întrebările
                                </Text>
                                <br />
                                După ce ai rezolvat testul, apasă butonul{" "}
                                <Text
                                  weight="600"
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="xs"
                                  style={{ display: "inline-block" }}
                                >
                                  {" "}
                                  Completază ora
                                </Text>
                              </>
                            )}
                          </Text>
                          {!completate[orar.date.indexOf(date)] ? (
                            <>
                              <Button
                                variant="default"
                                style={{ marginTop: "0.5rem" }}
                                onClick={() => {
                                  generateIntrebari(
                                    orar.materii[orar.date.indexOf(date)],
                                    orar.capitole[orar.date.indexOf(date)]
                                  );
                                  manageTest(date);
                                }}
                                disabled={completate[orar.date.indexOf(date)]}
                              >
                                Afișează întrebările
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => {
                                  checkScore(date);
                                }}
                                disabled={completate[orar.date.indexOf(date)]}
                                style={{ marginLeft: "0.5rem" }}
                              >
                                Completează ora
                              </Button>
                            </>
                          ) : null}
                        </Paper>
                        <Modal
                          centered
                          opened={testModal}
                          onClose={() => setTestModal(false)}
                          closeOnClickOutside={false}
                          title={
                            <Title order={4}>
                              Test {testMaterie}, {testCapitol}
                            </Title>
                          }
                        >
                          {currIntrebari.length > 0 ? (
                            <>
                              <Paper shadow="xl" radius="md" p="md" withBorder>
                                <Text weight="600" size="sm">
                                  {currIntrebari[pasTest].intrebare}
                                </Text>
                              </Paper>
                              <Center style={{ marginTop: "1rem" }}>
                                <RadioGroup
                                  value={segValue}
                                  onChange={setSegValue}
                                  orientation="vertical"
                                  label="Alege un raspuns"
                                  spacing="sm"
                                  size="md"
                                  required
                                >
                                  <Radio
                                    value={currIntrebari[pasTest].raspunsuri[0]}
                                    label={currIntrebari[pasTest].raspunsuri[0]}
                                  />
                                  <Radio
                                    value={currIntrebari[pasTest].raspunsuri[1]}
                                    label={currIntrebari[pasTest].raspunsuri[1]}
                                  />
                                  <Radio
                                    value={currIntrebari[pasTest].raspunsuri[2]}
                                    label={currIntrebari[pasTest].raspunsuri[2]}
                                  />
                                  <Radio
                                    value={currIntrebari[pasTest].raspunsuri[3]}
                                    label={currIntrebari[pasTest].raspunsuri[3]}
                                  />
                                </RadioGroup>
                              </Center>
                            </>
                          ) : null}
                          <Center style={{ marginTop: "1rem" }}>
                            <Button
                              variant="default"
                              onClick={() => {
                                if (pasTest < currIntrebari?.length - 1) {
                                  if (
                                    currIntrebari[pasTest].raspunsuri.indexOf(
                                      segValue
                                    ) +
                                      1 ==
                                    currIntrebari[pasTest].raspunsCorect
                                  ) {
                                    setScore((value) => value + 1);
                                  }
                                  setPasTest((value) => value + 1);
                                } else {
                                  if (
                                    currIntrebari[pasTest].raspunsuri.indexOf(
                                      segValue
                                    ) +
                                      1 ==
                                    currIntrebari[pasTest].raspunsCorect
                                  ) {
                                    setScore((value) => value + 1);
                                  }
                                  setTestModal(false);
                                  setPasTest(0);
                                }
                              }}
                            >
                              {pasTest < currIntrebari?.length - 1
                                ? "Următoarea întrebare"
                                : "Finalizare"}
                            </Button>
                          </Center>
                        </Modal>
                      </div>
                    }
                  </Accordion.Item>
                ))}
              </StyledAccordion>
            </Paper>
          </Tabs.Tab>
          <Tabs.Tab label="Calendar" icon={<CalendarEvent size={14} />}>
            <Paper
              shadow="xl"
              radius="md"
              p="xl"
              withBorder
              style={{ display: "flex" }}
            >
              <Center>
                <Paper shadow="xl" radius="md" p="xl" withBorder>
                  <Calendar
                    locale="ro"
                    value={value}
                    onChange={setValue}
                    size={windowDimension.winWidth > 768 ? "xl" : "sm"}
                    renderDay={(dateday) => {
                      const dayj = dayjs(dateday);
                      const day = dayj.format("DD/MM/YYYY");
                      return (
                        <>
                          <Indicator
                            color="teal"
                            disabled={
                              date.includes(day) == false ||
                              orar.date.indexOf(day) == -1 ||
                              orar.importante[orar.date.indexOf(day)] ==
                                undefined ||
                              orar.importante[orar.date.indexOf(day)] == false
                            }
                            label="Important"
                            size={18}
                            position="bottom-center"
                            withBorder
                            radius="md"
                            onClick={() => {
                              date.includes(day)
                                ? setOpenModal(true)
                                : setOpenModal(false);
                              setCurrDate(day);
                              generateIntrebari(
                                orar.materii[orar.date.indexOf(currDate)],
                                orar.capitole[orar.date.indexOf(currDate)]
                              );
                            }}
                          >
                            <Indicator
                              color={dark ? "violet" : "blue"}
                              withBorder
                              offset={8}
                              disabled={date.includes(day) == false}
                              onClick={() => {
                                date.includes(day)
                                  ? setOpenModal(true)
                                  : setOpenModal(false);
                                setCurrDate(day);
                                generateIntrebari(
                                  orar.materii[orar.date.indexOf(currDate)],
                                  orar.capitole[orar.date.indexOf(currDate)]
                                );
                              }}
                            >
                              <div>{dayj.format("D")}</div>
                            </Indicator>
                          </Indicator>
                        </>
                      );
                    }}
                  ></Calendar>
                </Paper>
              </Center>
              <Transition
                mounted={openModal}
                transition="slide-right"
                duration={300}
                exitDuration={300}
                timingFunction="ease"
              >
                {(styles) =>
                  windowDimension.winWidth > 720 && openModal ? (
                    <Center style={{ ...styles }}>
                      <Paper
                        shadow="xl"
                        radius="md"
                        p="xl"
                        withBorder
                        style={{
                          ...styles,
                          marginLeft: "2rem",
                        }}
                      >
                        <Paper p="xs" withBorder>
                          <Center>
                            {orar.importante[orar.date.indexOf(currDate)] ==
                            true ? (
                              <Badge color="teal">IMPORTANT</Badge>
                            ) : null}
                            {"  "}
                            {completate[orar.date.indexOf(currDate)] == true ? (
                              <Badge
                                color="green"
                                style={{ marginLeft: "0.5rem" }}
                              >
                                COMPLETAT
                              </Badge>
                            ) : null}
                          </Center>
                          <div
                            className="paper-content"
                            style={{
                              alignContent: "left",
                              alignItems: "left",
                              textAlign: "left",
                            }}
                          >
                            <Stack spacing="xs" style={{ marginLeft: "1rem" }}>
                              <div className="materie">
                                <Text weight="bold" size="sm">
                                  Materia
                                </Text>
                                <Center
                                  style={{
                                    alignContent: "left",

                                    float: "left",
                                  }}
                                >
                                  <Paper p="xs" radius="md" withBorder>
                                    <Text
                                      color={dark ? "#98a7ab" : "#495057"}
                                      size="sm"
                                      weight={500}
                                    >
                                      {
                                        orar.materii[
                                          orar.date.indexOf(currDate)
                                        ]
                                      }
                                    </Text>
                                  </Paper>
                                </Center>
                              </div>
                              <div className="capitol">
                                <Text weight="bold" size="sm">
                                  Capitol
                                </Text>
                                <Center
                                  style={{
                                    alignContent: "left",
                                    float: "left",
                                  }}
                                >
                                  <Paper p="xs" radius="md" withBorder>
                                    <Text
                                      color={dark ? "#98a7ab" : "#495057"}
                                      size="sm"
                                      weight={500}
                                    >
                                      {
                                        orar.capitole[
                                          orar.date.indexOf(currDate)
                                        ]
                                      }
                                    </Text>
                                  </Paper>
                                </Center>
                              </div>
                              <div className="ora">
                                <Text weight="bold" size="sm">
                                  Ora
                                </Text>
                                <Center
                                  style={{
                                    alignContent: "left",
                                    float: "left",
                                  }}
                                >
                                  <Paper p="xs" radius="md" withBorder>
                                    <Text
                                      color={dark ? "#98a7ab" : "#495057"}
                                      size="sm"
                                      weight={500}
                                    >
                                      {orar.ore[orar.date.indexOf(currDate)]}
                                    </Text>
                                  </Paper>
                                </Center>
                              </div>
                              <div className="durata">
                                <Text weight="bold" size="sm">
                                  Durata
                                </Text>
                                <Center
                                  style={{
                                    alignContent: "left",
                                    float: "left",
                                  }}
                                >
                                  <Paper p="xs" radius="md" withBorder>
                                    <Text
                                      color={dark ? "#98a7ab" : "#495057"}
                                      size="sm"
                                      weight={500}
                                    >
                                      {orar.durata[orar.date.indexOf(currDate)]}
                                    </Text>
                                  </Paper>
                                </Center>
                              </div>
                            </Stack>
                          </div>
                        </Paper>
                        <Paper
                          shadow="xl"
                          radius="md"
                          p="md"
                          withBorder
                          style={{ marginTop: "1rem" }}
                        >
                          <Text weight="600" size="sm">
                            Pune o întrebare despre ora aceasta
                          </Text>
                          <Text weight="600" size="xs" color="dimmed">
                            Întrebarea va fi publicată la secțiunea
                            <Badge color="gray">Întrebări</Badge> și orice
                            utliziator îți va putea răspunde.
                          </Text>
                          <Checkbox
                            label={"Doresc să rămân anonim"}
                            style={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                            checked={anonim}
                            onChange={(event) =>
                              setAnonim(event.currentTarget.checked)
                            }
                          />
                          <TextInput
                            variant="default"
                            placeholder="Intrebare"
                            value={intrebare}
                            onChange={(event) =>
                              setIntrebare(event.currentTarget.value)
                            }
                            style={{
                              display: "inline-block",
                              width: "75%",
                              marginRight: "0.5rem",
                            }}
                          />
                          <Button
                            variant="default"
                            style={{ display: "inline-block" }}
                            onClick={() => {
                              addQuestion(
                                intrebare,
                                orar.materii[orar.date.indexOf(currDate)],
                                orar.capitole[orar.date.indexOf(currDate)],
                                anonim == true ? "Anonim" : user.displayName
                              );
                            }}
                          >
                            Intreaba
                          </Button>
                        </Paper>
                        <Paper
                          shadow="xl"
                          radius="md"
                          p="md"
                          withBorder
                          style={{ marginTop: "1rem" }}
                        >
                          <Text weight="600" size="sm">
                            Completează ora
                          </Text>
                          <Text weight="600" size="xs" color="dimmed">
                            {completate[orar.date.indexOf(currDate)] ? (
                              <Text weight="600" size="md" color="green">
                                Ora a fost completată
                              </Text>
                            ) : (
                              <>
                                Pentru a completa ora, trebuie sa raspunzi
                                corect la cel puțin jumătate <br />
                                din întrebările care îți vor fi puse. Când ești
                                pregătit, apasă butonul{" "}
                                <Text
                                  weight="600"
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="xs"
                                  style={{ display: "inline-block" }}
                                >
                                  {" "}
                                  Afișează întrebările
                                </Text>
                                <br />
                                După ce ai rezolvat testul, apasă butonul{" "}
                                <Text
                                  weight="600"
                                  color={dark ? "#98a7ab" : "#495057"}
                                  size="xs"
                                  style={{ display: "inline-block" }}
                                >
                                  {" "}
                                  Completază ora
                                </Text>
                              </>
                            )}
                          </Text>
                          {!completate[orar.date.indexOf(currDate)] ? (
                            <>
                              <Button
                                variant="default"
                                style={{ marginTop: "0.5rem" }}
                                onClick={() => {
                                  generateIntrebari(
                                    orar.materii[orar.date.indexOf(currDate)],
                                    orar.capitole[orar.date.indexOf(currDate)]
                                  );
                                  manageTest();
                                }}
                                disabled={
                                  completate[orar.date.indexOf(currDate)]
                                }
                              >
                                Afișează întrebările
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => {
                                  checkScore();
                                }}
                                disabled={
                                  completate[orar.date.indexOf(currDate)]
                                }
                                style={{ marginLeft: "0.5rem" }}
                              >
                                Completează ora
                              </Button>
                            </>
                          ) : null}
                        </Paper>
                      </Paper>
                    </Center>
                  ) : null
                }
              </Transition>
            </Paper>
            <Modal
              centered
              opened={testModal}
              onClose={() => setTestModal(false)}
              closeOnClickOutside={false}
              title={
                <Title order={4}>
                  Test {testMaterie}, {testCapitol}
                </Title>
              }
            >
              {currIntrebari.length > 0 ? (
                <>
                  <Paper shadow="xl" radius="md" p="md" withBorder>
                    <Text weight="600" size="sm">
                      {currIntrebari[pasTest].intrebare}
                    </Text>
                  </Paper>
                  <Center style={{ marginTop: "1rem" }}>
                    <RadioGroup
                      value={segValue}
                      onChange={setSegValue}
                      orientation="vertical"
                      label="Alege un raspuns"
                      spacing="sm"
                      size="md"
                      required
                    >
                      <Radio
                        value={currIntrebari[pasTest].raspunsuri[0]}
                        label={currIntrebari[pasTest].raspunsuri[0]}
                      />
                      <Radio
                        value={currIntrebari[pasTest].raspunsuri[1]}
                        label={currIntrebari[pasTest].raspunsuri[1]}
                      />
                      <Radio
                        value={currIntrebari[pasTest].raspunsuri[2]}
                        label={currIntrebari[pasTest].raspunsuri[2]}
                      />
                      <Radio
                        value={currIntrebari[pasTest].raspunsuri[3]}
                        label={currIntrebari[pasTest].raspunsuri[3]}
                      />
                    </RadioGroup>
                  </Center>
                </>
              ) : null}
              <Center style={{ marginTop: "1rem" }}>
                <Button
                  variant="default"
                  onClick={() => {
                    if (pasTest < currIntrebari?.length - 1) {
                      if (
                        currIntrebari[pasTest].raspunsuri.indexOf(segValue) +
                          1 ==
                        currIntrebari[pasTest].raspunsCorect
                      ) {
                        setScore((value) => value + 1);
                      }
                      setPasTest((value) => value + 1);
                    } else {
                      if (
                        currIntrebari[pasTest].raspunsuri.indexOf(segValue) +
                          1 ==
                        currIntrebari[pasTest].raspunsCorect
                      ) {
                        setScore((value) => value + 1);
                      }
                      setTestModal(false);
                      setPasTest(0);
                    }
                  }}
                >
                  {pasTest < currIntrebari?.length - 1
                    ? "Următoarea întrebare"
                    : "Finalizare"}
                </Button>
              </Center>
            </Modal>
            <Modal
              centered
              opened={openModal && windowDimension.winWidth < 720}
              onClose={() => setOpenModal(false)}
              title={<Title order={3}>{}</Title>}
              overlayColor={
                theme.colorScheme === "dark"
                  ? theme.colors.dark[9]
                  : theme.colors.gray[2]
              }
              overlayOpacity={0.55}
              overlayBlur={3}
            >
              {
                <>
                  <div
                    className="paper-content"
                    style={{
                      alignContent: "left",
                      alignItems: "left",
                      textAlign: "left",
                    }}
                  >
                    <div className="materie">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Code>MATERIE:</Code>{" "}
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.materii[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                    <div className="capitol">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Code>CAPITOL:</Code>{" "}
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.capitole[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                    <div className="ora">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <Code>ORA:</Code>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.ore[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                    <div className="durata">
                      <Paper
                        shadow="xl"
                        p="5px"
                        withBorder
                        style={{ marginBottom: "1rem" }}
                      >
                        <Code>DURATA: </Code> &nbsp;
                        <Paper
                          p="0.4rem"
                          style={{
                            backgroundColor: dark ? "#141517" : "#f1f3f5",
                            display: "inline-block",
                            paddingLeft: "0.7rem",
                            paddingRight: "0.7rem",
                            margin: "0.5rem",
                          }}
                        >
                          <Center>
                            <Text
                              color={dark ? "#98a7ab" : "#495057"}
                              size="sm"
                              weight={500}
                            >
                              {orar.durata[orar.date.indexOf(currDate)]}
                            </Text>
                          </Center>
                        </Paper>
                      </Paper>
                    </div>
                  </div>
                </>
              }
              {}
              {}
            </Modal>
          </Tabs.Tab>
        </Tabs>
      </Center>
    </div>
  );
};
export default View;
