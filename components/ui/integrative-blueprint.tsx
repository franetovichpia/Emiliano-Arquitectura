type IntegrativeBlueprintProps = {
  className?: string;
};

export function IntegrativeBlueprint({
  className = "absolute inset-0 size-full",
}: IntegrativeBlueprintProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 760"
    >
      <defs>
        <pattern
          height="38"
          id="integrative-small-grid"
          patternUnits="userSpaceOnUse"
          width="38"
        >
          <path
            d="M38 0H0V38"
            opacity="0.12"
            stroke="#c9dce3"
            strokeWidth="0.8"
          />
        </pattern>

        <pattern
          height="152"
          id="integrative-grid"
          patternUnits="userSpaceOnUse"
          width="152"
        >
          <rect
            fill="url(#integrative-small-grid)"
            height="152"
            width="152"
          />

          <path
            d="M152 0H0V152"
            opacity="0.16"
            stroke="#dce9ee"
            strokeWidth="1"
          />
        </pattern>

        <linearGradient
          id="integrative-fade"
          x1="0"
          x2="1"
          y1="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#dce9ee"
            stopOpacity="0.72"
          />

          <stop
            offset="1"
            stopColor="#91a88c"
            stopOpacity="0.3"
          />
        </linearGradient>
      </defs>

      <rect
        fill="url(#integrative-grid)"
        height="760"
        width="1200"
      />

      {/* Líneas de perspectiva */}
      <g
        opacity="0.2"
        stroke="#dce9ee"
        strokeWidth="1"
      >
        <path d="M40 690L600 105" />
        <path d="M1160 690L600 105" />
        <path d="M120 690L600 105" />
        <path d="M1080 690L600 105" />
        <path d="M0 650H1200" />
        <path d="M0 610H1200" />
      </g>

      {/* Edificio */}
      <g
        stroke="url(#integrative-fade)"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M220 610V277L610 164V610Z" />
        <path d="M610 164L956 292V610H610Z" />
        <path d="M220 277L520 108L610 164" />
        <path d="M520 108L850 228L956 292" />

        <path d="M260 319L580 226V303L260 381Z" />
        <path d="M260 407L580 334V414L260 466Z" />
        <path d="M260 495L580 445V529L260 557Z" />

        <path d="M642 224L914 324V390L642 302Z" />
        <path d="M642 334L914 416V486L642 417Z" />
        <path d="M642 448L914 512V578L642 531Z" />

        <path d="M350 610V498L471 478V610" />
        <path d="M724 610V486L840 515V610" />
      </g>

      {/* Ventanas y estructura */}
      <g
        opacity="0.38"
        stroke="#dce9ee"
        strokeWidth="1"
      >
        <path d="M320 301V365" />
        <path d="M395 279V347" />
        <path d="M470 257V329" />
        <path d="M535 238V312" />

        <path d="M320 393V456" />
        <path d="M395 376V444" />
        <path d="M470 359V431" />
        <path d="M535 344V420" />

        <path d="M693 243V319" />
        <path d="M756 266V340" />
        <path d="M819 289V362" />
        <path d="M875 310V383" />

        <path d="M693 350V430" />
        <path d="M756 369V446" />
        <path d="M819 389V463" />
        <path d="M875 405V478" />
      </g>

      {/* Acentos constructivos */}
      <g
        opacity="0.72"
        stroke="#c66f4e"
        strokeWidth="2"
      >
        <path d="M220 610H956" />
        <path d="M220 277L610 164L956 292" />
        <path d="M610 164V610" />
      </g>

      {/* Árbol izquierdo */}
      <g>
        <path
          d="M151 623V474M151 524L116 488M151 540L184 499"
          opacity="0.7"
          stroke="#c66f4e"
          strokeLinecap="round"
          strokeWidth="2"
        />

        <g
          fill="#91a88c"
          fillOpacity="0.12"
          stroke="#a9bba3"
          strokeWidth="1.5"
        >
          <circle
            cx="119"
            cy="466"
            r="47"
          />

          <circle
            cx="169"
            cy="452"
            r="56"
          />

          <circle
            cx="199"
            cy="491"
            r="42"
          />

          <circle
            cx="148"
            cy="502"
            r="53"
          />
        </g>
      </g>

      {/* Árbol derecho */}
      <g>
        <path
          d="M1027 628V484M1027 535L991 500M1027 548L1066 506"
          opacity="0.7"
          stroke="#c66f4e"
          strokeLinecap="round"
          strokeWidth="2"
        />

        <g
          fill="#91a88c"
          fillOpacity="0.12"
          stroke="#a9bba3"
          strokeWidth="1.5"
        >
          <circle
            cx="985"
            cy="482"
            r="45"
          />

          <circle
            cx="1032"
            cy="460"
            r="58"
          />

          <circle
            cx="1073"
            cy="493"
            r="48"
          />

          <circle
            cx="1027"
            cy="515"
            r="54"
          />
        </g>
      </g>

      {/* Terreno */}
      <g
        opacity="0.38"
        stroke="#a9bba3"
        strokeWidth="1.2"
      >
        <path d="M40 647C192 616 310 642 452 631C626 616 710 647 874 630C1011 616 1104 630 1180 616" />
        <path d="M20 675C185 650 327 676 478 662C643 647 743 681 915 657C1037 640 1122 653 1200 642" />
        <path d="M0 706C180 680 342 705 510 690C704 672 818 708 1007 685C1084 676 1148 678 1200 671" />
      </g>

      {/* Nodos */}
      <g fill="#c66f4e">
        <circle
          cx="220"
          cy="610"
          r="4"
        />

        <circle
          cx="610"
          cy="164"
          r="4"
        />

        <circle
          cx="956"
          cy="610"
          r="4"
        />
      </g>
    </svg>
  );
}