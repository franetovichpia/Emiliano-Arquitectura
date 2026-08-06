export function ArchitecturalBlueprint() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
      fill="none"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 900"
    >
      <defs>
        {/* Sombreado técnico diagonal */}
        <pattern
          height="9"
          id="blueprint-hatch"
          patternTransform="rotate(14)"
          patternUnits="userSpaceOnUse"
          width="9"
        >
          <line
            stroke="#d9eef4"
            strokeOpacity="0.2"
            strokeWidth="1"
            x1="0"
            x2="0"
            y1="0"
            y2="9"
          />
        </pattern>

        {/* Sombreado más cerrado */}
        <pattern
          height="6"
          id="blueprint-hatch-dense"
          patternTransform="rotate(-18)"
          patternUnits="userSpaceOnUse"
          width="6"
        >
          <line
            stroke="#d9eef4"
            strokeOpacity="0.17"
            strokeWidth="0.8"
            x1="0"
            x2="0"
            y1="0"
            y2="6"
          />
        </pattern>

        {/* Degradado para perder el dibujo hacia la izquierda */}
        <linearGradient
          id="blueprint-fade"
          x1="0"
          x2="1"
          y1="0"
          y2="0"
        >
          <stop
            offset="0"
            stopColor="#d9eef4"
            stopOpacity="0.08"
          />

          <stop
            offset="0.34"
            stopColor="#d9eef4"
            stopOpacity="0.45"
          />

          <stop
            offset="1"
            stopColor="#d9eef4"
            stopOpacity="0.85"
          />
        </linearGradient>

        {/* Árbol técnico reutilizable */}
        <g id="blueprint-tree">
          <path
            d="M0 132V48M0 84L-22 61M0 73L20 48M0 100L27 78M0 92L-30 73"
            stroke="#d9eef4"
            strokeLinecap="round"
            strokeOpacity="0.58"
            strokeWidth="1.2"
          />

          <path
            d="M-6 51C-36 42-45 16-26 1C-8-14 8 2 8 21C17-1 43-8 55 12C68 33 46 52 23 51C42 61 44 87 23 97C2 107-14 91-14 71C-29 88-55 80-58 57C-61 37-38 26-20 34"
            fill="url(#blueprint-hatch-dense)"
            stroke="#d9eef4"
            strokeOpacity="0.54"
            strokeWidth="1"
          />
        </g>
      </defs>

      {/* Líneas de perspectiva general */}
      <g
        opacity="0.3"
        stroke="#d9eef4"
        strokeDasharray="8 12"
        strokeWidth="0.85"
      >
        <path d="M320 810L1042 140" />
        <path d="M1580 810L1042 140" />
        <path d="M560 810L1042 140" />
        <path d="M1360 810L1042 140" />
        <path d="M1042 55V815" />
      </g>

      {/* Volúmenes del edificio */}
      <g
        fill="url(#blueprint-hatch)"
        stroke="url(#blueprint-fade)"
        strokeLinejoin="round"
        strokeWidth="1.3"
      >
        {/* Volumen frontal */}
        <polygon points="610,314 1038,164 1080,724 596,746" />

        {/* Volumen derecho */}
        <polygon points="1038,164 1448,322 1480,714 1080,724" />

        {/* Volumen izquierdo */}
        <polygon points="610,314 402,421 416,725 596,746" />

        {/* Cubierta */}
        <polygon points="610,314 1038,164 1448,322 1019,478" />

        {/* Volumen superior */}
        <polygon points="727,254 1035,139 1246,221 931,338" />

        {/* Lateral superior */}
        <polygon points="1035,139 1246,221 1249,318 1038,242" />
      </g>

      {/* Contornos principales */}
      <g
        stroke="#e6f3f6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.64"
        strokeWidth="1.45"
      >
        <path d="M596 746L610 314L1038 164L1448 322L1480 714L1080 724L596 746Z" />
        <path d="M610 314L1019 478L1448 322" />
        <path d="M1038 164L1080 724" />

        <path d="M727 254L1035 139L1246 221L1249 318L1019 400L727 291Z" />
        <path d="M727 254V291" />
        <path d="M1035 139L1038 242" />
        <path d="M1038 242L1249 318" />
      </g>

      {/* Plantas y losas */}
      <g
        stroke="#d9eef4"
        strokeOpacity="0.53"
        strokeWidth="1.15"
      >
        {/* Fachada principal */}
        <path d="M604 418L1047 304" />
        <path d="M602 522L1056 443" />
        <path d="M599 629L1068 585" />

        {/* Fachada derecha */}
        <path d="M1047 304L1457 408" />
        <path d="M1056 443L1465 514" />
        <path d="M1068 585L1474 621" />

        {/* Fachada izquierda */}
        <path d="M604 418L407 489" />
        <path d="M602 522L411 560" />
        <path d="M599 629L414 650" />

        {/* Estructura vertical */}
        <path d="M700 284L688 742" />
        <path d="M796 250L791 737" />
        <path d="M894 216L895 733" />
        <path d="M989 183L1002 728" />

        <path d="M1130 200L1168 722" />
        <path d="M1221 235L1260 720" />
        <path d="M1310 269L1353 717" />
        <path d="M1392 301L1439 715" />

        <path d="M506 367L514 735" />
        <path d="M456 395L465 730" />
      </g>

      {/* Ventanas fachada principal */}
      <g
        fill="#d9eef4"
        fillOpacity="0.045"
        stroke="#d9eef4"
        strokeOpacity="0.48"
        strokeWidth="0.95"
      >
        {/* Nivel superior */}
        <polygon points="633,346 686,330 684,395 631,407" />
        <polygon points="709,323 770,304 769,376 707,391" />
        <polygon points="794,297 859,278 860,357 793,373" />
        <polygon points="887,270 956,249 961,336 888,353" />

        {/* Nivel medio */}
        <polygon points="629,444 684,433 682,501 627,509" />
        <polygon points="708,427 772,415 772,487 706,497" />
        <polygon points="796,409 864,396 867,473 796,484" />
        <polygon points="892,390 968,376 973,458 894,471" />

        {/* Nivel inferior */}
        <polygon points="624,550 681,544 678,612 621,616" />
        <polygon points="705,540 773,534 773,605 703,611" />
        <polygon points="797,530 868,524 871,598 797,604" />
        <polygon points="896,520 976,513 981,591 898,598" />
      </g>

      {/* Ventanas fachada derecha */}
      <g
        fill="#d9eef4"
        fillOpacity="0.035"
        stroke="#d9eef4"
        strokeOpacity="0.44"
        strokeWidth="0.9"
      >
        <polygon points="1084,310 1141,324 1147,397 1090,385" />
        <polygon points="1162,330 1222,345 1230,414 1169,400" />
        <polygon points="1244,351 1303,366 1313,430 1252,417" />
        <polygon points="1324,372 1382,387 1394,447 1334,434" />

        <polygon points="1093,458 1153,468 1159,539 1099,532" />
        <polygon points="1178,474 1238,484 1247,549 1185,542" />
        <polygon points="1263,489 1323,500 1333,560 1271,552" />
        <polygon points="1347,504 1405,515 1417,572 1356,563" />
      </g>

      {/* Accesos */}
      <g
        stroke="#e6f3f6"
        strokeOpacity="0.62"
        strokeWidth="1.2"
      >
        <polygon points="812,640 907,636 910,728 810,733" />
        <path d="M860 638V730" />

        <polygon points="1112,610 1205,617 1213,719 1120,721" />
        <path d="M1160 614L1167 720" />

        <path d="M773 733L811 692H908L948 731" />
        <path d="M742 748L790 683H926L978 735" />
      </g>

      {/* Barandas y detalles */}
      <g
        stroke="#d9eef4"
        strokeOpacity="0.43"
        strokeWidth="0.85"
      >
        <path d="M624 512L1049 446" />
        <path d="M627 501L1048 431" />

        <path d="M1086 436L1459 493" />
        <path d="M1087 447L1460 508" />

        <path d="M650 493V508M690 486V501M730 479V495M770 472V488M810 466V482M850 459V476M890 453V470M930 446V464M970 439V458M1010 433V451" />

        <path d="M1112 447V461M1150 453V467M1190 459V473M1230 465V480M1270 471V486M1310 477V493M1350 483V499M1390 489V506" />
      </g>

      {/* Terreno y cotas */}
      <g
        stroke="#d9eef4"
        strokeLinecap="round"
        strokeOpacity="0.45"
        strokeWidth="0.95"
      >
        <path d="M72 765C268 729 414 767 596 746C817 721 1016 742 1191 724C1322 710 1446 726 1570 696" />
        <path d="M58 791C258 758 425 793 603 775C812 754 1034 775 1200 753C1361 731 1459 751 1580 725" />

        <path
          d="M242 824H1392"
          strokeDasharray="10 8"
        />

        <path d="M242 812V836" />
        <path d="M528 812V836" />
        <path d="M814 812V836" />
        <path d="M1102 812V836" />
        <path d="M1392 812V836" />

        <path
          d="M365 388V746"
          strokeDasharray="8 10"
        />

        <path d="M352 388H378" />
        <path d="M352 746H378" />
      </g>

      {/* Anotaciones abstractas */}
      <g
        opacity="0.38"
        stroke="#d9eef4"
        strokeLinecap="round"
        strokeWidth="0.85"
      >
        <path d="M1128 74C1162 64 1197 67 1231 73C1265 79 1299 73 1336 63" />
        <path d="M1121 87C1171 81 1218 93 1268 87C1302 83 1332 75 1360 78" />
        <path d="M1137 100C1175 98 1213 105 1252 101C1294 97 1329 88 1372 92" />
        <path d="M1190 114C1234 109 1272 120 1314 112" />

        <path d="M182 326C214 312 249 319 277 308" />
        <path d="M175 339C219 332 256 340 298 329" />
        <path d="M195 353C231 345 266 352 311 341" />
      </g>

      {/* Vegetación */}
      <g opacity="0.72">
        <use
          href="#blueprint-tree"
          transform="translate(507 610) scale(0.86)"
        />

        <use
          href="#blueprint-tree"
          transform="translate(1288 589) scale(1.05)"
        />

        <use
          href="#blueprint-tree"
          transform="translate(1412 624) scale(0.76)"
        />

        <use
          href="#blueprint-tree"
          transform="translate(322 661) scale(0.7)"
        />
      </g>

      {/* Acentos naranjas de estructura */}
      <g
        stroke="#d98a6b"
        strokeLinecap="round"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      >
        <path d="M610 314L1038 164" />
        <path d="M1038 164L1448 322" />
        <path d="M596 746L610 314" />
        <path d="M1080 724L1038 164" />
        <path d="M599 629L1068 585L1474 621" />
      </g>

      {/* Acentos verdes */}
      <g
        stroke="#a7ba9f"
        strokeLinecap="round"
        strokeOpacity="0.72"
        strokeWidth="1.8"
      >
        <path d="M85 765C243 697 389 779 531 720" />
        <path d="M1206 741C1300 685 1394 697 1518 661" />
      </g>
    </svg>
  );
}