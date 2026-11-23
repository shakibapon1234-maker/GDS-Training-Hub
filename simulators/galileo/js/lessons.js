(function (global) {
  const lessons = {
    BASIC: {
      title: "BASIC ONE-WAY BOOKING",
      objective: "Create and retrieve a one-passenger PNR.",
      commands: ["SON/DEMO/DEMO", "A01APRDACJED", "N1Y1", "N/DOE/JOHN MR", "9/8801712345678", "T-01APR", "RF-JOHN", "ER"]
    },
    TICKETING: {
      title: "PNR PRICING AND TICKETING",
      objective: "Retrieve a saved PNR, quote the fare, store it, and issue a practice ticket.",
      commands: ["*G7L3QK", "FQ", "FXP", "TKPFS/DTDAD"]
    },
    MODIFICATION: {
      title: "PNR MODIFICATION",
      objective: "Practice cancelling a booked air segment and adding a special service.",
      commands: ["*G7L3QK", "X1", "SI.SSR MEAL"]
    },
    REISSUE: {
      title: "UNUTILIZED TICKET REISSUE (GALILEO EXCHANGE)",
      objective: "Manual ticket reissue in Galileo/Travelport Smartpoint: fare quote, historical rules, fare build mask (*FB1), tax deletion (FBUTAX1/), TR tax difference (FBUTAX1/4 TR), reissue penalty (FBUTAX2/6768XP), recalculate (FBUTTL/), file fare (FBF), exchange modifier (TMU1FEX), commission (TMU1Z0) and exchange issue (TKPDTD).",
      commands: [
        "*TK7REI",
        "FQCTK/ET",
        "FD05JAN22DACDXB/TK-OW.T21DEC21",
        "*FB1",
        "FBUTAX1/",
        "FBUTAX1/4 TR",
        "FBUTAX2/6768XP",
        "FBUTTL/",
        "FBF",
        "R.R",
        "ER",
        "TMU1FEX2358910482910",
        "TMU1Z0",
        "R.R",
        "ER",
        "TKPDTD"
      ]
    },
    REFUND: {
      title: "ELECTRONIC TICKET FULL REFUND (GALILEO)",
      objective: "Full ticket refund workflow in Galileo/Smartpoint: retrieve PNR by passenger surname (*-RAHMAN or *BG7REF), cancel flight segment (@1-3XK or XI), save PNR (R.M + ER + IR), display electronic ticket record (*TE/99755555555555), check refund penalty in Cat 16 (FD27MARZYLDAC/BG-OW::BDT), open electronic refund mask (TRNE99755555555555/26MAR20), review gross fare, cancellation charge & net refund, and confirm refund (TRNE/OK).",
      commands: [
        "*-RAHMAN",
        "@1-3XK",
        "R.M",
        "ER",
        "IR",
        "*TE/99755555555555",
        "FD27MARZYLDAC/BG-OW::BDT",
        "TRNE99755555555555/26MAR20",
        "TRNE/OK",
        "*TE"
      ]
    },
    AUTOREFUND: {
      title: "TRNF - AUTOMATED FARE REFUND (GALILEO SMARTPOINT)",
      objective: "Automated fare refund in Galileo/Smartpoint using TRNF: retrieve practice PNR (*TK8AFR), review ticket status (*HTE and *TE), check Cat 16 rules (FD...), run TRNF to let the system auto-calculate penalty and refund amounts from active PNR ticket (no ticket number needed), review the auto-populated mask, and confirm with TRNF/OK.",
      commands: [
        "*TK8AFR",
        "*HTE",
        "*TE",
        "FD15JAN26DACIST/TK-OW.T10JAN26",
        "TRNF",
        "TRNF/OK",
        "*TE"
      ]
    }
  };

  global.GalileoLessons = {
    get(name) { return lessons[name.trim().toUpperCase()] || null; },
    format(lesson) { return [`LESSON: ${lesson.title}`, `OBJECTIVE: ${lesson.objective}`, "COMMAND SEQUENCE:", ...lesson.commands.map((command, index) => `${index + 1}. ${command}`)]; }
  };
}(window));