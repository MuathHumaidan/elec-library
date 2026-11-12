/* Self-study content (flashcards + «رتّب» / «وصّل») — الرسم الفني الكهربائي (عملي). Data only.
   Facts follow the book (page refs = printed pages); where the lesson marks a book error, the corrected fact is used.
   Symbol cards: small inline SVG (IEC 60617 style); cards marked «إضافة من خارج الكتاب» fill cells the book leaves empty.
   Order activities are only real procedures/sequences from the book (drawing steps, construction steps, current paths read from the book's figures). */
PLCBOOK.study({
 "units": {
  "u1": {
   "title": "أساسيات الرسم الفني",
   "cards": [
    {
     "k": "def",
     "f": "أقسام الرسم الفني",
     "b": "قسمان: الرسم الفني باستخدام الحاسب (برامج الكاد CAD)، والرسم الفني اليدوي.",
     "ref": "ص 9"
    },
    {
     "k": "def",
     "f": "برامج الكاد CAD",
     "b": "تتميز بالسرعة والسهولة والدقة في تحضير الرسومات أو تعديلها. والكمبيوتر أداة رسم فقط: لا يفكر ولا يتخذ قرارات.",
     "ref": "ص 9"
    },
    {
     "k": "symbol",
     "f": "أقلام الرصاص 2H و HB و 2B",
     "b": "<b>2H</b> خفيف الظل سهل المسح للخطوط الإنشائية، و<b>HB</b> معتدل الظل لتشطيب الرسم والكتابة، و<b>2B</b> غامق ثقيل الظل لتثبيت الرسم النهائي ويترك أثراً بعد المسح.",
     "ref": "ص 10"
    },
    {
     "k": "def",
     "f": "المسطرة حرف (T)",
     "b": "ترسم بها الخطوط الأفقية المتوازية، وتنزلق عليها المثلثات. وحافة لوحة الرسم دليل لها.",
     "ref": "ص 10"
    },
    {
     "k": "symbol",
     "f": "مقاسات ورق الرسم A4 … A0",
     "b": "A4 = 297 × 210 · A3 = 420 × 297 · A2 = 594 × 420 · A1 = 841 × 594 · A0 = 1189 × 841 (بالمليمتر). كل مقاس ضعف الذي قبله.",
     "ref": "ص 11"
    },
    {
     "k": "def",
     "f": "ورق الكلك",
     "b": "ورق خفيف نصف شفاف مائل للزرقة، تُشف عليه الرسومات بالرصاص أو الحبر ثم تُطبع على ورق حساس بماكينة خاصة.",
     "ref": "ص 11"
    },
    {
     "k": "def",
     "f": "ترتيب العمل بالقلم",
     "b": "تبدأ بقلم 2H بخطوط رفيعة خفيفة ليسهل التعديل، وبعد التأكد من صحة الرسم تُمحى الخطوط الزائدة وتُغمق الخطوط بالسمك المناسب لنوعها.",
     "ref": "ص 12"
    },
    {
     "k": "def",
     "f": "الفرجار",
     "b": "تُفتح ساقاه مسافة تساوي نصف القطر، وتثبت الإبرة في محور الدائرة، ويتحرك في اتجاه عقرب الساعة مع إمالته قليلاً. وفرجار التقسيم (بإبرتين) لنقل المسافات وتقسيمها.",
     "ref": "ص 12–13"
    },
    {
     "k": "law",
     "f": "مقياس الرسم",
     "b": "مقياس الرسم = طول الرسم ÷ الطول الحقيقي للجسم. أقل من 1 تصغير (1 : n)، وأكبر من 1 تكبير (n : 1). ويُكتب واضحاً على اللوحة.",
     "ref": "ص 13"
    },
    {
     "k": "def",
     "f": "قواعد خطوط الأبعاد",
     "b": "الخط المساعد كامل رفيع عمودي على الحافة ولا يقل عن 10 mm. خط البعد كامل رفيع يبعد عن الحافة 8 mm تقريباً، وبين خطوط الأبعاد المتوازية 5 mm على الأقل، والأسهم مصمتة.",
     "ref": "ص 16"
    },
    {
     "k": "def",
     "f": "كتابة أرقام الأبعاد",
     "b": "بالكتابة القياسية DIN 16، ارتفاع الأرقام نحو 4 mm، وتُقرأ من أسفل أو من جهة اليمين. ولا يُكتب البعد أكثر من مرة، ولا تُوضع أبعاد غير ضرورية.",
     "ref": "ص 15–16"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 44\" width=\"140\" height=\"44\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"20\" y1=\"4\" x2=\"20\" y2=\"40\" stroke-width=\"1.2\"/><line x1=\"120\" y1=\"4\" x2=\"120\" y2=\"40\" stroke-width=\"1.2\"/><line x1=\"20\" y1=\"30\" x2=\"120\" y2=\"30\" stroke-width=\"1.2\"/><path d=\"M20 30 l9 -3.5 v7 z\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M120 30 l-9 -3.5 v7 z\" fill=\"currentColor\" stroke=\"none\"/><text x=\"70\" y=\"25\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"13\" font-family=\"sans-serif\" font-weight=\"normal\">50</text></svg><br>ما اسم هذا الخط؟",
     "b": "خط بعد: خط كامل رفيع بين خطين مساعدين، ينتهي بسهمين مصمتين، والرقم في منتصفه (فراغ كتابة الأبعاد).",
     "ref": "ص 16"
    },
    {
     "k": "law",
     "f": "المنظور متساوي القياس (أيزومتري)",
     "b": "α = β = 30° والأضلاع a : b : c = 1 : 1 : 1.",
     "ref": "ص 17"
    },
    {
     "k": "law",
     "f": "المنظور ثنائي القياس (ديمتري)",
     "b": "α = 7° و β = 42° والأضلاع a : b : c = 1 : 1 : ½. يعطي أفضلية لإظهار أحد جوانب الجسم.",
     "ref": "ص 17"
    },
    {
     "k": "def",
     "f": "أوضاع المساقط الثلاثة",
     "b": "المسقط الجانبي (بالنظر من اليسار) على يمين المسقط الرأسي وعلى مستواه، والمسقط الأفقي (بالنظر من أعلى) أسفل المسقط الرأسي تماماً.",
     "ref": "ص 17"
    },
    {
     "k": "def",
     "f": "كيف يظهر السطح في المسقط؟",
     "b": "السطح الموازي لمستوى الإسقاط يظهر بشكله وأبعاده الحقيقية، والعمودي عليه يظهر حافة (خطاً)، والمائل لا يظهر بأبعاده الحقيقية وتُعرف من مسقطين.",
     "ref": "ص 19"
    },
    {
     "k": "def",
     "f": "طرق استنتاج المسقط الثالث",
     "b": "نقل الحواف من المسقطين، والانعكاس على خط مساعد يميل 45°، والنقل بالفرجار. والنقطة المطلوبة تقاطع خطين أحدهما من كل مسقط معلوم.",
     "ref": "ص 20–24"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 30\" width=\"140\" height=\"30\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"10\" y1=\"15\" x2=\"130\" y2=\"15\" stroke-width=\"1.6\" stroke-dasharray=\"10 4\" stroke-linecap=\"butt\"/></svg><br>ما اسم هذا الخط؟",
     "b": "خط الحافة المختفية: خط متقطع بشرط متساوية ومسافات متساوية، بنصف ثخانة الخط الكامل، يبدأ وينتهي بشرطة، والأركان تبدأ بشرطة.",
     "ref": "ص 25–26"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 30\" width=\"140\" height=\"30\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"8\" y1=\"15\" x2=\"132\" y2=\"15\" stroke-width=\"1.6\" stroke-dasharray=\"18 3 2 3\" stroke-linecap=\"butt\"/></svg><br>ما اسم هذا الخط؟",
     "b": "خط المنتصف (محور التماثل): شرطة ونقطة بنصف ثخانة الحافة الظاهرة، يبدأ وينتهي بشرطة ويتعدى حافة الجسم، ولا يمتد من مسقط إلى آخر.",
     "ref": "ص 28"
    },
    {
     "k": "def",
     "f": "خط المنتصف والأبعاد",
     "b": "تُنسب الأبعاد إليه ويعدّ خطاً مساعداً لها، لكنه لا يُستعمل خط أبعاد، ولا يتخلل أرقام الأبعاد. وخطا المنتصف يتقاطعان عند الشرط.",
     "ref": "ص 28–29"
    },
    {
     "k": "def",
     "f": "الزوايا وأنصاف الأقطار",
     "b": "تُوضع الزاوية إذا اختلفت عن 90°، وخط بعدها قوس مركزه رأس الزاوية. وأنصاف الأقطار المتساوية يُكتب أحدها فقط، وسهمه من الداخل كلما أمكن.",
     "ref": "ص 31–35"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 90 40\" width=\"90\" height=\"40\" role=\"img\" aria-label=\"رمز القطر\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"30\" cy=\"22\" r=\"7\" stroke-width=\"1.6\"/><line x1=\"25\" y1=\"34\" x2=\"35\" y2=\"10\" stroke-width=\"1.6\"/><text x=\"62\" y=\"28\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"16\" font-family=\"sans-serif\" font-weight=\"normal\">20</text></svg><br>ما هذا الرمز؟",
     "b": "رمز القطر ϕ: دائرة بحجم حرف الكتابة الصغير يقطعها خط يميل 75° عن الأفقي، ارتفاعه الكلي = ارتفاع الأرقام، ويُكتب على يسار الرقم. يغني عن رسم المسقط الدائري.",
     "ref": "ص 37"
    },
    {
     "k": "def",
     "f": "أنواع القطاع",
     "b": "قطاع كامل (الجسم مقطوع كله)، ونصف قطاع (نصف خارجي ونصف مقطوع يفصلهما خط المنتصف)، وقطاع جزئي (جزء مقطوع يحده خط كسر حر).",
     "ref": "ص 39"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 72\" width=\"140\" height=\"72\" role=\"img\" aria-label=\"تهشير\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"40\" y=\"6\" width=\"60\" height=\"60\" stroke-width=\"2.6\"/><line x1=\"40\" y1=\"18\" x2=\"52\" y2=\"6\" stroke-width=\"1\"/><line x1=\"40\" y1=\"30\" x2=\"64\" y2=\"6\" stroke-width=\"1\"/><line x1=\"40\" y1=\"42\" x2=\"76\" y2=\"6\" stroke-width=\"1\"/><line x1=\"40\" y1=\"54\" x2=\"88\" y2=\"6\" stroke-width=\"1\"/><line x1=\"40\" y1=\"66\" x2=\"100\" y2=\"6\" stroke-width=\"1\"/><line x1=\"52\" y1=\"66\" x2=\"100\" y2=\"18\" stroke-width=\"1\"/><line x1=\"64\" y1=\"66\" x2=\"100\" y2=\"30\" stroke-width=\"1\"/><line x1=\"76\" y1=\"66\" x2=\"100\" y2=\"42\" stroke-width=\"1\"/><line x1=\"88\" y1=\"66\" x2=\"100\" y2=\"54\" stroke-width=\"1\"/></svg><br>ماذا تعني هذه الخطوط؟",
     "b": "خطوط الرقن (التهشير): خطوط كاملة رفيعة مائلة 45° تميز سطح القطاع. لكل جزء متجاور اتجاه أو كثافة مختلفة، وتُقطع حول الأرقام.",
     "ref": "ص 42"
    },
    {
     "k": "def",
     "f": "أجزاء لا تُهشَّر عند القطع الطولي",
     "b": "الأعصاب (الوترات)، والأجسام المصمتة البسيطة: التيل، البرشام، الأعمدة، المحاور، المسامير الملولبة، الصواميل، النوابض، الخوابير، الأسافين. ولا تُرسم الحواف المختفية في القطاع إلا للضرورة.",
     "ref": "ص 42"
    }
   ]
  },
  "u2": {
   "title": "الرموز الكهربائية والإلكترونية",
   "cards": [
    {
     "k": "def",
     "f": "لماذا رموز لا صور؟",
     "b": "رسم التوصيلات الكهربائية يهتم بأداء الجهاز ومسار التيار وطريقة مد الأسلاك، لا بشكل الجزء الخارجي؛ لذلك تمثل الأجهزة برموز دالة على مغزاها.",
     "ref": "ص 48"
    },
    {
     "k": "def",
     "f": "الدائرة الرمزية والدائرة التنفيذية في الجداول",
     "b": "الرمزية مختصرة: مجموعة الأسلاك بخط واحد وعددها بشرطات مائلة. التنفيذية يظهر فيها كل سلك وكل طرف وكل ملامس.",
     "ref": "ص 48–60"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 46\" width=\"140\" height=\"46\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"6\" y1=\"30\" x2=\"134\" y2=\"30\"/><line x1=\"53\" y1=\"38\" x2=\"63\" y2=\"22\"/><line x1=\"62\" y1=\"38\" x2=\"72\" y2=\"22\"/></svg><br>ماذا تعني الشرطتان؟",
     "b": "خط واحد يمثل سلكين. ثلاث شرطات = ثلاثة أسلاك، أو شرطة واحدة بجانبها رقم العدد.",
     "ref": "ص 49"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 80 70\" width=\"80\" height=\"70\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"40\" y1=\"2\" x2=\"40\" y2=\"12\"/><circle cx=\"40\" cy=\"38\" r=\"26\"/><text x=\"40\" y=\"40\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"18\" font-family=\"sans-serif\" font-weight=\"bold\">G</text><text x=\"40\" y=\"57\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"12\" font-family=\"sans-serif\" font-weight=\"normal\">~</text></svg><br>ما هذا الرمز؟",
     "b": "مصدر (مولد) تيار متردد في الدائرة التنفيذية: دائرة بداخلها G وتحتها ~. ومصدر التيار المستمر: G وتحته خط.",
     "ref": "ص 48"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"54\" y2=\"25\"/><line x1=\"66\" y1=\"25\" x2=\"116\" y2=\"25\"/><line x1=\"54\" y1=\"8\" x2=\"54\" y2=\"42\" stroke-width=\"2\"/><line x1=\"66\" y1=\"16\" x2=\"66\" y2=\"34\" stroke-width=\"4.5\"/><text x=\"44\" y=\"12\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"13\" font-family=\"sans-serif\" font-weight=\"normal\">+</text><text x=\"78\" y=\"12\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"13\" font-family=\"sans-serif\" font-weight=\"normal\">−</text></svg><br>ما هذا الرمز؟",
     "b": "بطارية أو منبع قدرة تيار مستمر: الخط الطويل الموجب والقصير السالب. (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 48"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 80 46\" width=\"80\" height=\"46\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"40\" y1=\"4\" x2=\"40\" y2=\"26\"/><line x1=\"22\" y1=\"26\" x2=\"58\" y2=\"26\"/><line x1=\"28\" y1=\"33\" x2=\"52\" y2=\"33\"/><line x1=\"34\" y1=\"40\" x2=\"46\" y2=\"40\"/></svg><br>ما هذا الرمز؟",
     "b": "نقطة توصيل أرضي. (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 48"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"36\" y2=\"25\"/><line x1=\"84\" y1=\"25\" x2=\"116\" y2=\"25\"/><rect x=\"36\" y=\"17\" width=\"48\" height=\"16\"/></svg><br>ما هذا الرمز؟",
     "b": "مقاومة: مستطيل بطرفين. (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 48"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"36\" y2=\"25\"/><line x1=\"84\" y1=\"25\" x2=\"116\" y2=\"25\"/><rect x=\"36\" y=\"17\" width=\"48\" height=\"16\"/><line x1=\"42\" y1=\"42\" x2=\"80\" y2=\"8\"/><path d=\"M80 8 l-8 2 l4 5 z\" fill=\"currentColor\" stroke=\"none\"/></svg><br>ما هذا الرمز؟",
     "b": "مقاومة متغيرة القيمة: السهم المائل يعني «متغير». (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 48"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 40\" width=\"120\" height=\"40\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"30\" x2=\"24\" y2=\"30\"/><path d=\"M24 30 a9 9 0 0 1 18 0 a9 9 0 0 1 18 0 a9 9 0 0 1 18 0 a9 9 0 0 1 18 0\"/><line x1=\"96\" y1=\"30\" x2=\"116\" y2=\"30\"/></svg><br>ما هذا الرمز؟",
     "b": "ملف: أقواس متتالية. (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 48"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"54\" y2=\"25\"/><line x1=\"66\" y1=\"25\" x2=\"116\" y2=\"25\"/><line x1=\"54\" y1=\"10\" x2=\"54\" y2=\"40\" stroke-width=\"3\"/><line x1=\"66\" y1=\"10\" x2=\"66\" y2=\"40\" stroke-width=\"3\"/></svg><br>ما هذا الرمز؟",
     "b": "مكثف: لوحان متوازيان بطرفين، والرمز نفسه في الدائرتين. ومع سهم مائل = مكثف متغير.",
     "ref": "ص 49"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"44\" y2=\"25\"/><line x1=\"76\" y1=\"25\" x2=\"116\" y2=\"25\"/><circle cx=\"60\" cy=\"25\" r=\"16\"/><text x=\"60\" y=\"30\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"15\" font-family=\"sans-serif\" font-weight=\"bold\">V</text></svg><br>ما هذا الرمز؟",
     "b": "مقياس فولت (فولتميتر). وبالمثل: A أمبيرميتر، Ω أوم ميتر، W وات ميتر، Hz مقياس تردد.",
     "ref": "ص 49"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"46\" y2=\"25\"/><line x1=\"74\" y1=\"25\" x2=\"116\" y2=\"25\"/><circle cx=\"60\" cy=\"25\" r=\"14\"/><line x1=\"50\" y1=\"15\" x2=\"70\" y2=\"35\"/><line x1=\"70\" y1=\"15\" x2=\"50\" y2=\"35\"/></svg><br>ما هذا الرمز؟",
     "b": "لمبة (مصباح): دائرة بداخلها X. (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 50"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 50\" width=\"120\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"25\" x2=\"116\" y2=\"25\"/><rect x=\"38\" y=\"17\" width=\"44\" height=\"16\"/></svg><br>ما هذا الرمز؟",
     "b": "مصهر: مستطيل يمر به الخط. (إضافة من خارج الكتاب: IEC 60617)",
     "ref": "ص 56"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 60 50\" width=\"60\" height=\"50\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"30\" cy=\"25\" r=\"14\"/><circle cx=\"30\" cy=\"25\" r=\"3.5\" fill=\"currentColor\"/></svg><br>ما هذا الرمز؟",
     "b": "مفتاح تشغيل يدوي (ضاغط) برجوع ذاتي في الدائرة الرمزية: دائرة بداخلها نقطة.",
     "ref": "ص 54"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 60 60\" width=\"60\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"30\" y1=\"4\" x2=\"30\" y2=\"20\"/><line x1=\"30\" y1=\"56\" x2=\"30\" y2=\"40\"/><line x1=\"30\" y1=\"40\" x2=\"18\" y2=\"19\"/></svg><br>ما هذا الرمز؟",
     "b": "ملامس وصل (مفتوح): يغلق الدائرة عند تشغيله.",
     "ref": "ص 54"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 60 60\" width=\"60\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"30\" y1=\"4\" x2=\"30\" y2=\"20\"/><line x1=\"30\" y1=\"20\" x2=\"18\" y2=\"20\"/><line x1=\"30\" y1=\"56\" x2=\"30\" y2=\"40\"/><line x1=\"30\" y1=\"40\" x2=\"15\" y2=\"17\"/></svg><br>ما هذا الرمز؟",
     "b": "ملامس فصل (مغلق): ذراعه يرتكز على شرطة صغيرة في الطرف العلوي، ويفتح الدائرة عند تشغيله.",
     "ref": "ص 54"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 60\" width=\"120\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"30\" x2=\"46\" y2=\"30\"/><path d=\"M46 18 L46 42 L70 30 Z\"/><line x1=\"70\" y1=\"30\" x2=\"116\" y2=\"30\"/><line x1=\"70\" y1=\"18\" x2=\"70\" y2=\"42\"/></svg><br>ما هذا الرمز؟",
     "b": "دايود: المثلث جهة المصعد، والخط الرأسي عند رأسه المهبط.",
     "ref": "ص 52"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 60\" width=\"120\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"30\" x2=\"46\" y2=\"30\"/><path d=\"M46 18 L46 42 L70 30 Z\"/><line x1=\"70\" y1=\"30\" x2=\"116\" y2=\"30\"/><path d=\"M64 16 L70 18 L70 42 L76 44\"/></svg><br>ما هذا الرمز؟",
     "b": "دايود زينر: رمز الدايود مع ثني طرف خط المهبط.",
     "ref": "ص 52"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 60\" width=\"120\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"30\" x2=\"46\" y2=\"30\"/><path d=\"M46 18 L46 42 L70 30 Z\"/><line x1=\"70\" y1=\"30\" x2=\"116\" y2=\"30\"/><line x1=\"70\" y1=\"18\" x2=\"70\" y2=\"42\"/><line x1=\"62\" y1=\"14\" x2=\"74\" y2=\"2\"/><path d=\"M74 2 l-6 1 l4 4 z\" fill=\"currentColor\" stroke=\"none\"/><line x1=\"72\" y1=\"18\" x2=\"84\" y2=\"6\"/><path d=\"M84 6 l-6 1 l4 4 z\" fill=\"currentColor\" stroke=\"none\"/></svg><br>ما هذا الرمز؟",
     "b": "دايود مشع (LED): سهمان خارجان من الدايود. والدايود الضوئي سهماه داخلان.",
     "ref": "ص 52"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 60\" width=\"120\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"30\" x2=\"46\" y2=\"30\"/><path d=\"M46 18 L46 42 L70 30 Z\"/><line x1=\"70\" y1=\"30\" x2=\"116\" y2=\"30\"/><line x1=\"70\" y1=\"18\" x2=\"70\" y2=\"42\"/><line x1=\"70\" y1=\"42\" x2=\"82\" y2=\"52\"/><line x1=\"82\" y1=\"52\" x2=\"82\" y2=\"58\"/></svg><br>ما هذا الرمز؟",
     "b": "ثايرستور قابل للتحكم من جهة المهبط: بوابة تخرج من جهة المهبط.",
     "ref": "ص 52"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 80 60\" width=\"80\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"30\" x2=\"40\" y2=\"30\"/><line x1=\"40\" y1=\"12\" x2=\"40\" y2=\"48\" stroke-width=\"3\"/><line x1=\"40\" y1=\"22\" x2=\"66\" y2=\"6\"/><line x1=\"40\" y1=\"38\" x2=\"66\" y2=\"54\"/><path d=\"M66 54 l-9 -1 l4 -6 z\" fill=\"currentColor\" stroke=\"none\"/></svg><br>ما هذا الرمز؟",
     "b": "ترانزستور NPN: سهم الباعث خارج من القاعدة. وفي PNP السهم داخل نحو القاعدة.",
     "ref": "ص 52"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 64\" width=\"120\" height=\"64\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"40\" y=\"6\" width=\"40\" height=\"52\"/><text x=\"60\" y=\"37\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"15\" font-family=\"sans-serif\" font-weight=\"bold\">&</text><line x1=\"8\" y1=\"16\" x2=\"40\" y2=\"16\"/><line x1=\"8\" y1=\"32\" x2=\"40\" y2=\"32\"/><line x1=\"8\" y1=\"48\" x2=\"40\" y2=\"48\"/><line x1=\"80\" y1=\"32\" x2=\"112\" y2=\"32\"/></svg><br>ما هذا الرمز؟",
     "b": "بوابة «و» AND: مستطيل بداخله &. ومع دائرة نفي على الخرج = NAND.",
     "ref": "ص 53"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 64\" width=\"120\" height=\"64\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"40\" y=\"6\" width=\"40\" height=\"52\"/><text x=\"60\" y=\"37\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"15\" font-family=\"sans-serif\" font-weight=\"bold\">≥1</text><line x1=\"8\" y1=\"16\" x2=\"40\" y2=\"16\"/><line x1=\"8\" y1=\"32\" x2=\"40\" y2=\"32\"/><line x1=\"8\" y1=\"48\" x2=\"40\" y2=\"48\"/><circle cx=\"85\" cy=\"32\" r=\"5\"/><line x1=\"90\" y1=\"32\" x2=\"112\" y2=\"32\"/></svg><br>ما هذا الرمز؟",
     "b": "بوابة «أو منفية» NOR: مستطيل بداخله ≥1 ودائرة نفي على الخرج. وبلا دائرة = OR.",
     "ref": "ص 53"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 120 64\" width=\"120\" height=\"64\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"40\" y=\"6\" width=\"40\" height=\"52\"/><text x=\"60\" y=\"37\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"15\" font-family=\"sans-serif\" font-weight=\"bold\">1</text><line x1=\"8\" y1=\"32\" x2=\"40\" y2=\"32\"/><circle cx=\"85\" cy=\"32\" r=\"5\"/><line x1=\"90\" y1=\"32\" x2=\"112\" y2=\"32\"/></svg><br>ما هذا الرمز؟",
     "b": "بوابة «لا» NOT: مستطيل بداخله 1، دخل واحد، وخرج بدائرة نفي.",
     "ref": "ص 53"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 100 60\" width=\"100\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"20\" y=\"16\" width=\"60\" height=\"28\"/><line x1=\"50\" y1=\"2\" x2=\"50\" y2=\"16\"/><line x1=\"50\" y1=\"44\" x2=\"50\" y2=\"58\"/><rect x=\"20\" y=\"16\" width=\"20\" height=\"28\"/><line x1=\"20\" y1=\"16\" x2=\"40\" y2=\"44\"/><line x1=\"40\" y1=\"16\" x2=\"20\" y2=\"44\"/></svg><br>ما هذا الرمز؟",
     "b": "مؤقت زمني يؤخر عند التوصيل: ملف جزؤه الأيسر مربع بداخله X. والمربع المصمت = يؤخر عند الفصل.",
     "ref": "ص 55"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 60 60\" width=\"60\" height=\"60\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"14\" y=\"14\" width=\"32\" height=\"32\"/><line x1=\"30\" y1=\"2\" x2=\"30\" y2=\"20\"/><path d=\"M30 20 H22 V40 H30\"/><line x1=\"30\" y1=\"40\" x2=\"30\" y2=\"58\"/></svg><br>ما هذا الرمز؟",
     "b": "متمم حراري يعمل عند زيادة الحمل: خط ينحرف داخل المستطيل على شكل ⊏ (العنصر الحراري).",
     "ref": "ص 55"
    },
    {
     "k": "symbol",
     "f": "I&gt; · I&lt; · U&lt;",
     "b": "رموز تنفيذية داخل مستطيل: <b>I&gt;</b> قاطع ضد زيادة التيار، <b>I&lt;</b> ضد التيار المنخفض، <b>U&lt;</b> قاطع عند الجهد المنخفض.",
     "ref": "ص 55"
    },
    {
     "k": "symbol",
     "f": "n&gt; على الوصلة",
     "b": "مفتاح تشغيل ميكانيكي يعمل بالقوة الطاردة المركزية (حسب السرعة). والمربع الفارغ = تشغيل ميكانيكي، والملف = تشغيل كهرومغناطيسي.",
     "ref": "ص 54"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 80 70\" width=\"80\" height=\"70\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"40\" y1=\"2\" x2=\"40\" y2=\"12\"/><circle cx=\"40\" cy=\"26\" r=\"14\"/><circle cx=\"40\" cy=\"44\" r=\"14\"/><line x1=\"40\" y1=\"58\" x2=\"40\" y2=\"68\"/></svg><br>ما هذا الرمز؟",
     "b": "محول أحادي الوجه بملفين منفصلين (في الدائرة الرمزية). ومع سهم مائل = قابل للضبط.",
     "ref": "ص 57"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 80 70\" width=\"80\" height=\"70\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"40\" y1=\"2\" x2=\"40\" y2=\"12\"/><circle cx=\"40\" cy=\"38\" r=\"26\"/><text x=\"40\" y=\"40\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"18\" font-family=\"sans-serif\" font-weight=\"bold\">M</text><text x=\"40\" y=\"57\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"12\" font-family=\"sans-serif\" font-weight=\"normal\">3~</text></svg><br>ما هذا الرمز؟",
     "b": "محرك تيار متردد ثلاثي الأوجه. و M مع 1~ = أحادي الوجه، و G مع 3~ = مولد ثلاثي الأوجه.",
     "ref": "ص 58"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 80 70\" width=\"80\" height=\"70\" role=\"img\" aria-label=\"رمز\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"40\" y1=\"2\" x2=\"40\" y2=\"12\"/><circle cx=\"40\" cy=\"38\" r=\"26\"/><text x=\"40\" y=\"45\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"18\" font-family=\"sans-serif\" font-weight=\"bold\">M</text><line x1=\"31\" y1=\"50\" x2=\"49\" y2=\"50\"/></svg><br>ما هذا الرمز؟",
     "b": "محرك تيار مستمر: الخط تحت الحرف M يعني تيار مستمر. وبالمثل G مع خط = مولد تيار مستمر.",
     "ref": "ص 58"
    },
    {
     "k": "symbol",
     "f": "A1–A2 · F1–F2 · E1–E2 · D1–D2",
     "b": "أطراف آلات التيار المستمر: A1–A2 العضو الدوار (المنتج)، F1–F2 المجال منفصل التغذية، E1–E2 مجال التوازي، D1–D2 مجال التوالي.",
     "ref": "ص 58–59"
    }
   ]
  },
  "u3": {
   "title": "الدوائر الخطية والتنفيذية للتوصيلات المنزلية",
   "cards": [
    {
     "k": "def",
     "f": "مخطط بيان التوصيلات",
     "b": "رسم تخطيطي واحد يسجل أحمال الإضاءة والقدرة وطريقة إنشاء لوحة التوزيع وشبكة تركيب الأسلاك داخل المبنى الجديد.",
     "ref": "ص 63"
    },
    {
     "k": "def",
     "f": "قسما التوصيلات المنزلية",
     "b": "لغرض الإنارة، ولأغراض التشغيل والإدارة للأحمال الأخرى (تكييف، أفران، غسالات، سخانات…) بتوصيلات خاصة لمآخذ التيار.",
     "ref": "ص 63"
    },
    {
     "k": "def",
     "f": "خطوات مخطط بيان التوصيلات (7)",
     "b": "المسقط الأفقي للمبنى ← مواضع المقابس ونوعها وكميتها ← مواضع المفاتيح ← موضع لوحة التوزيع ← أماكن المقابس ← عدد الدوائر الفرعية ← مساحة مقطع الكابل.",
     "ref": "ص 64"
    },
    {
     "k": "def",
     "f": "الدائرة الكهربائية الخطية",
     "b": "الدائرة التي تحتوي على المفهوم العام للدائرة الكهربائية ومكوناتها دون التعرض للتفاصيل.",
     "ref": "ص 65"
    },
    {
     "k": "def",
     "f": "الدائرة الكهربائية التنفيذية",
     "b": "الدائرة التي توضح جميع التوصيلات الخاصة في الدائرة مع المصدر والمفاتيح ومصابيح الإنارة.",
     "ref": "ص 65"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 46\" width=\"140\" height=\"46\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"6\" y1=\"30\" x2=\"134\" y2=\"30\"/><line x1=\"53\" y1=\"38\" x2=\"63\" y2=\"22\"/><line x1=\"62\" y1=\"38\" x2=\"72\" y2=\"22\"/><line x1=\"71\" y1=\"38\" x2=\"81\" y2=\"22\"/></svg><br>كم سلكاً على هذا الخط؟",
     "b": "ثلاثة أسلاك. عدد الشُّرَط في الخطية = عدد الأسلاك التي ترسمها في التنفيذية.",
     "ref": "ص 65–80"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 46\" width=\"140\" height=\"46\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"6\" y1=\"30\" x2=\"134\" y2=\"30\"/><line x1=\"65\" y1=\"38\" x2=\"75\" y2=\"22\"/><text x=\"84\" y=\"22\" text-anchor=\"start\" fill=\"currentColor\" stroke=\"none\" font-size=\"13\" font-family=\"sans-serif\" font-weight=\"normal\">4</text></svg><br>ماذا تعني الشرطة والرقم؟",
     "b": "أربعة أسلاك (كما على خط المفتاح الوسطي في دائرة السلم 3-4 أ).",
     "ref": "ص 68"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 62\" width=\"140\" height=\"62\" role=\"img\" aria-label=\"خطوط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"36\" y1=\"12\" x2=\"136\" y2=\"12\"/><text x=\"4\" y=\"16\" text-anchor=\"start\" fill=\"currentColor\" stroke=\"none\" font-size=\"12\" font-family=\"sans-serif\" font-weight=\"normal\">L1</text><line x1=\"36\" y1=\"32\" x2=\"136\" y2=\"32\" stroke-dasharray=\"14 3 2 3\" stroke-linecap=\"butt\"/><text x=\"4\" y=\"36\" text-anchor=\"start\" fill=\"currentColor\" stroke=\"none\" font-size=\"12\" font-family=\"sans-serif\" font-weight=\"normal\">N</text><line x1=\"36\" y1=\"52\" x2=\"136\" y2=\"52\" stroke-dasharray=\"7 4\" stroke-linecap=\"butt\"/><text x=\"4\" y=\"56\" text-anchor=\"start\" fill=\"currentColor\" stroke=\"none\" font-size=\"12\" font-family=\"sans-serif\" font-weight=\"normal\">PE</text></svg><br>ماذا تعني هذه الأنماط؟",
     "b": "في الشكل (3-3) ب: L1 خط متصل، و N (المحايد) شرطة-نقطة، و PE (موصل الحماية) خط متقطع يوصل بجسم كل كشاف.",
     "ref": "ص 67"
    },
    {
     "k": "def",
     "f": "المفتاح المفرد في (3-1)",
     "b": "يقع على الخط L1: L1 ← المفتاح ← المصباح ← L2. وبين كل علبتين سلكان.",
     "ref": "ص 65–66"
    },
    {
     "k": "def",
     "f": "المفتاح المزدوج (3-2)",
     "b": "مفتاحان في علبة واحدة بطرف تغذية مشترك من L1؛ كل ذراع تغذي مصباحاً. لذلك ثلاث شُرَط على خطه في الخطية.",
     "ref": "ص 66"
    },
    {
     "k": "def",
     "f": "مفاتيح دائرة السلم (3-4)",
     "b": "مفتاحان ذوا اتجاهين في الطرفين (3 أسلاك لكل منهما) ومفتاح وسطي بينهما (4 أسلاك). بينها سلكان مسافران، وتغيير أي مفتاح يقلب حالة المصابيح.",
     "ref": "ص 68"
    },
    {
     "k": "def",
     "f": "مسار التيار في كشاف الفلورسنت (3-5)",
     "b": "L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى ← البادئ ← الفتيلة اليسرى ← N. البادئ بين الطرفين العلويين للفتيلتين.",
     "ref": "ص 69"
    },
    {
     "k": "def",
     "f": "العداد في (3-6)",
     "b": "النص يقول «مصباحين» والشكل فيه مصباح واحد. والعداد عادة يركب في بداية التغذية قبل المصهر واللوحة (ملاحظة الدرس).",
     "ref": "ص 70"
    },
    {
     "k": "def",
     "f": "جرس الجهد المنخفض (3-8)",
     "b": "محول الجرس يخفض الجهد إلى 12 أو 24 فولت: الضاغط على جانب الابتدائي، والجرس على طرفي الثانوي فقط.",
     "ref": "ص 72"
    },
    {
     "k": "def",
     "f": "مفتاح صدمة التيار (3-9)",
     "b": "دائرة تحكم: الضواغط على التوازي ← الملف. ودائرة قدرة: التلامس 1–2 ← المصابيح. كل ضغطة من أي ضاغط تقلب حالة التلامس.",
     "ref": "ص 73–74"
    },
    {
     "k": "symbol",
     "f": "أطراف المزمن 1 · 2 · 3 · 7",
     "b": "في (3-10) ب: 1 و2 على L1، و3 يغذي المصابيح، و7 إلى الضواغط (طرفها الآخر L2). الإنارة تنطفئ وحدها بعد وقت محدد.",
     "ref": "ص 74–75"
    },
    {
     "k": "def",
     "f": "تصميم لوحة التوزيع للوحدة السكنية",
     "b": "تُعرف كل التجهيزات والأجهزة المطلوبة، ثم تقسم الوحدة إلى دوائر (كل دائرة على عدد من المصابيح والمقابس والأجهزة).",
     "ref": "ص 77"
    },
    {
     "k": "symbol",
     "f": "H07 V-R Cu 2,5²",
     "b": "مكتوب على خطوط المخطط: نوع الموصل ومادته ومقطعه — موصل نحاسي معزول مقطعه 2.5 mm² (الكتاب لا يشرح الاختصار).",
     "ref": "ص 76–78"
    },
    {
     "k": "def",
     "f": "دوائر الوحدة السكنية (3-11)",
     "b": "ست دوائر: 1 محرك 2.2 kW (3 مصاهر 20 A)، 2 مصابيح (10 A)، 3 مقابس (20 A)، 4 تكييف 4.5 kW (20 A)، 5 فرن 7.5 kW (35 A)، 6 سخان 4 kW (20 A).",
     "ref": "ص 77"
    }
   ]
  },
  "u4": {
   "title": "تغذية المصانع وشبكات التوزيع",
   "cards": [
    {
     "k": "def",
     "f": "الشبكة الشعاعية",
     "b": "أفرع الموصلات تنطلق من نقطة التغذية بشكل شعاعي وعلى كل جزء عدة أحمال؛ تستخدم في الجهد المنخفض والمتوسط، والعطل في شعاع لا يضر باقي المصنع.",
     "ref": "ص 83"
    },
    {
     "k": "def",
     "f": "من أين يتغذى المصنع؟",
     "b": "في العادة لا يتغذى من الشبكة المحلية، بل من شبكة الجهد المتوسط، وفي حالات عديدة من الجهد العالي.",
     "ref": "ص 83"
    },
    {
     "k": "symbol",
     "f": "المفاتيح (أ) (ب) (جـ) في الشكل (4-1)",
     "b": "(أ) أوتوماتيكي: وقاية المحول وموصل الموزع الرئيس والموزع الفرعي، ويفصل المنشأة كلها. (ب) أوتوماتيكي: وقاية موصل الموزع الفرعي والموزع نفسه. (جـ) في مدخل الموزع الفرعي لفصله.",
     "ref": "ص 83"
    },
    {
     "k": "symbol",
     "f": "المفاتيح (د) (هـ) (و) في الشكل (4-1)",
     "b": "(د) أوتوماتيكي: وقاية موصل موزع الأحمال والموزع نفسه. (هـ) في مدخل موزع المستهلك لفصله. (و) تجهيزات لوقاية الموصلات والأجهزة.",
     "ref": "ص 83–84"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 140 46\" width=\"140\" height=\"46\" role=\"img\" aria-label=\"خط\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"6\" y1=\"30\" x2=\"134\" y2=\"30\"/><line x1=\"65\" y1=\"38\" x2=\"75\" y2=\"22\"/><text x=\"84\" y=\"22\" text-anchor=\"start\" fill=\"currentColor\" stroke=\"none\" font-size=\"13\" font-family=\"sans-serif\" font-weight=\"normal\">4</text></svg><br>على الخط الخارج من المحول",
     "b": "أربعة موصلات (ثلاثة أوجه وموصل التعادل).",
     "ref": "ص 84"
    },
    {
     "k": "def",
     "f": "واجبا لوحات التوزيع",
     "b": "(1) عدم السماح بمرور تيار أكبر من قابلية الشبكة. (2) قطع الدائرة بسرعة مع تجنب حدوث القصر أو تسرب تيار أكثر من الطبيعي.",
     "ref": "ص 85"
    },
    {
     "k": "def",
     "f": "سعة لوحة المصنع",
     "b": "تتحمل مفاتيحها وقواطعها أقصى حمل عند الذروة، وغالباً 100% من الحمل الموجود، مع حساب التوسعات المستقبلية. ويفضل قواطع الدورة ذات سعات العزل العالية.",
     "ref": "ص 85"
    },
    {
     "k": "def",
     "f": "لوحة للإضاءة وأخرى للقوى",
     "b": "حتى تكون الإضاءة منفصلة تماماً عن القوى، وتحدد قدرة كل محرك لاختيار كابله.",
     "ref": "ص 86"
    },
    {
     "k": "def",
     "f": "المواصفات العامة للوحة التوزيع (1)",
     "b": "صاج 2 مم بدهان إلكتروستاتيكي، على قاعدة خرسانية 20 سم، ومستوى كل قاطع يطابق دائرته، والقواطع مناسبة نوعاً وحجماً.",
     "ref": "ص 87"
    },
    {
     "k": "def",
     "f": "المواصفات العامة للوحة التوزيع (2)",
     "b": "أميترات وفولتميتر، ولمبات إشارة للأوجه الثلاثة، وقضيب أرضي للوقاية، وقاطع أوتوماتيكي رئيس بملفات قطع عند زيادة التيار أو الجهد.",
     "ref": "ص 87"
    },
    {
     "k": "symbol",
     "f": "3×50 mm² + 25 mm² ألمنيوم",
     "b": "مقطع الكابل الرئيس للوحة قوى الورشة (اللوحة 200 × 80 سم وعرض 40 سم).",
     "ref": "ص 87"
    },
    {
     "k": "law",
     "f": "كثافة التيار في القضبان العمومية",
     "b": "يجب ألا تزيد عن 4 A/mm² (قضبان من النحاس الأحمر الكهربي).",
     "ref": "ص 89، 93"
    },
    {
     "k": "def",
     "f": "لوحة توزيع القوى للمصنع (4-4)",
     "b": "ثلاث خلايا (دخول واثنتان للخروج)، تتحمل 1000 A، مغلقة، وتبعد عن الحائط متراً للصيانة.",
     "ref": "ص 89"
    },
    {
     "k": "def",
     "f": "لوحة توزيع الإضاءة للمصنع (4-7)",
     "b": "خليتان (دخول وخروج)، تتحمل 500 A، وقضبانها للأوجه بالألوان الأحمر والأصفر والأزرق.",
     "ref": "ص 93"
    },
    {
     "k": "symbol",
     "f": "كابل المحركات: 3 × 6 mm² + 4 mm²",
     "b": "أربعة أسلاك: ثلاثة مقطعها 6 مم² والرابع 4 مم² سلك أرضي. وسلك الأرضي العام يتصل بجسم المحرك ثم بالقضيب الأرضي في اللوحة.",
     "ref": "ص 92"
    },
    {
     "k": "def",
     "f": "لوحة إضاءة الورشة (4-5)",
     "b": "80 × 80 سم وعرض 40 سم: مصباح للوحة، مفتاح أوتوماتيكي 20 A، لمبة إشارة، ثلاثة مصاهر 5 A، وخمسة مفاتيح أوتوماتيكية 5 A للخروج.",
     "ref": "ص 92"
    }
   ]
  },
  "u5": {
   "title": "مخططات توصيل الآلات الكهربائية",
   "cards": [
    {
     "k": "def",
     "f": "المحرك والمولد",
     "b": "المحرك يحوّل الطاقة الكهربائية إلى ميكانيكية، والمولد يحوّل الميكانيكية إلى كهربائية.",
     "ref": "ص 102"
    },
    {
     "k": "def",
     "f": "الآلات الحثية والتزامنية",
     "b": "الحثية: يستقبل الملف في جانب الطاقة من الملف في الجانب الآخر بالحث (الثلاثية الأكثر استخداماً). التزامنية: سرعتها متزامنة مع المجال الدوار (مولدات المحطات).",
     "ref": "ص 102"
    },
    {
     "k": "def",
     "f": "التغذية المنفصلة",
     "b": "طاقة المجال من مصدر خارج الآلة، وملف العضو الدوار وملفات المجال منفصلة كهربياً.",
     "ref": "ص 103"
    },
    {
     "k": "law",
     "f": "قطبية A1 واتجاه الدوران",
     "b": "إذا دار العضو الدوار إلى اليمين فإن A1 موجب، وإلى اليسار فإن A1 سالب (والتيار في المجال من F1/E1/D1 إلى نهايته).",
     "ref": "ص 103–107"
    },
    {
     "k": "def",
     "f": "عكس اتجاه محرك التيار المستمر",
     "b": "نعكس أحد التيارين فقط: العضو الدوار (A1/A2) أو المجال. عكسهما معاً (أو تبديل سلكي التغذية) يبقي الاتجاه.",
     "ref": "ص 103–104، 131"
    },
    {
     "k": "def",
     "f": "محرك التوالي",
     "b": "دائرة المجال D1–D2 على التوالي مع العضو الدوار. لا يُشغَّل بلا حمل لأنه يتسارع حتى التدمير. وفي (5-5) القنطرة D1–A2.",
     "ref": "ص 104–106"
    },
    {
     "k": "def",
     "f": "محرك التوازي",
     "b": "ملف المجال E1–E2 على التوازي مع العضو الدوار على أطراف التغذية. وفي (5-9) القنطرتان A1–E1 و E2–A2.",
     "ref": "ص 107–108"
    },
    {
     "k": "def",
     "f": "مفتاح وقاية المحرك (5-10)",
     "b": "ثلاثي الأقطاب: الحراري يفصل بعد مدة عند زيادة الحمل، والمغناطيسي I> فوراً عند القصر. وفي دائرة التيار المستمر يمرر السالب في قطبين بقنطرة 3–5.",
     "ref": "ص 109"
    },
    {
     "k": "def",
     "f": "المحرك المركب",
     "b": "على كل قطب نوعان من لفائف المجال: توازٍ E1–E2 على أطراف التغذية، وتوالٍ D1–D2 في مسار العضو الدوار.",
     "ref": "ص 110"
    },
    {
     "k": "def",
     "f": "المولد التزامني",
     "b": "العضو الساكن عضو استنتاج، والدوار أقطاب تغذى بالتيار المستمر عبر حلقات انزلاق وفرش. ومقاومة متغيرة تنظم تيار التنبيه فالجهد.",
     "ref": "ص 111"
    },
    {
     "k": "def",
     "f": "الأقطاب البارزة والغاطسة",
     "b": "البارزة في المولدات منخفضة السرعة، والغاطسة (غير البارزة) في مولدات السرعة العالية.",
     "ref": "ص 111"
    },
    {
     "k": "def",
     "f": "توصيل أجهزة القياس",
     "b": "الأميتر على التوالي في الخط، والفولتميتر ومقياس التردد على التوازي بين خطين.",
     "ref": "ص 112"
    },
    {
     "k": "def",
     "f": "المولد التزامني ثلاثي الأوجه",
     "b": "ثلاثة أفرع ملفات مزاحة 120°، توصل نجمة أو مثلثاً. والتردد يعتمد على عدد أزواج الأقطاب وسرعة الدوران.",
     "ref": "ص 113"
    },
    {
     "k": "def",
     "f": "محولات القياس",
     "b": "محول الجهد ومحولات التيار تخفض الجهد والتيار لتشغيل أجهزة القياس في دوائر الجهد العالي.",
     "ref": "ص 114–115"
    },
    {
     "k": "def",
     "f": "ملفات المحرك الحثي أحادي الوجه",
     "b": "رئيس (تشغيل) ومساعد؛ أفضل الظروف: الرئيس في ثلثي مجاري العضو الساكن والمساعد في الثلث. والعضو الدوار مقصر الدائرة.",
     "ref": "ص 117"
    },
    {
     "k": "def",
     "f": "أنواع المحرك أحادي الوجه بالمكثف",
     "b": "مكثف تشغيل مستمر: معامل قدرة جيد. مكثف بدء: عزم بدء جيد (المرحل يوصل المساعد عند تيار البدء العالي). مكثف بدء وتشغيل: معامل قدرة جيد مع عزم بدء عالٍ.",
     "ref": "ص 117–118"
    },
    {
     "k": "def",
     "f": "المحرك ذو القطب المظلل",
     "b": "أقطاب بارزة أزيل منها جزء لتكوين مجرى توضع فيه حلقة نحاسية لتقصير الدائرة.",
     "ref": "ص 118"
    },
    {
     "k": "symbol",
     "f": "U1–U2 · Z1–Z2",
     "b": "في المحرك أحادي الوجه: U1–U2 الملف الرئيس، و Z1–Z2 الملف المساعد. عكس الاتجاه بتبديل نهايتي المساعد.",
     "ref": "ص 59، 119"
    },
    {
     "k": "def",
     "f": "نوعا العضو الدوار للمحرك الثلاثي",
     "b": "قفص سنجابي (قضبان ألمنيوم في شرائح صلب سليكوني مقصورة بحلقتين)، وملفوف بحلقات انزلاق (ملفات نجمة + فرش + مقاومة متغيرة): عزم بدء كبير بتيار بدء منخفض.",
     "ref": "ص 120"
    },
    {
     "k": "law",
     "f": "توصيلة النجمة",
     "b": "\\(V_L=\\sqrt{3}\\,V_{ph}\\) و \\(I_L=I_{ph}\\). تتصل البدايات (أو النهايات) في نقطة التعادل.",
     "ref": "ص 120"
    },
    {
     "k": "law",
     "f": "توصيلة المثلث",
     "b": "\\(V_L=V_{ph}\\) و \\(I_L=\\sqrt{3}\\,I_{ph}\\). بداية كل وجه في نهاية الوجه السابق.",
     "ref": "ص 121"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 130 80\" width=\"130\" height=\"80\" role=\"img\" aria-label=\"لوحة أطراف\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"25\" cy=\"22\" r=\"6\"/><text x=\"25\" y=\"10\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">U1</text><circle cx=\"65\" cy=\"22\" r=\"6\"/><text x=\"65\" y=\"10\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">V1</text><circle cx=\"105\" cy=\"22\" r=\"6\"/><text x=\"105\" y=\"10\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">W1</text><circle cx=\"25\" cy=\"54\" r=\"6\"/><text x=\"25\" y=\"74\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">W2</text><circle cx=\"65\" cy=\"54\" r=\"6\"/><text x=\"65\" y=\"74\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">U2</text><circle cx=\"105\" cy=\"54\" r=\"6\"/><text x=\"105\" y=\"74\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">V2</text><line x1=\"31\" y1=\"54\" x2=\"59\" y2=\"54\" stroke-width=\"4\"/><line x1=\"71\" y1=\"54\" x2=\"99\" y2=\"54\" stroke-width=\"4\"/></svg><br>ما التوصيلة؟",
     "b": "نجمة: القنطرة تجمع W2 و U2 و V2 (الصف السفلي) في نقطة واحدة، والتغذية على U1 و V1 و W1.",
     "ref": "ص 120"
    },
    {
     "k": "circuit",
     "f": "<svg viewBox=\"0 0 130 80\" width=\"130\" height=\"80\" role=\"img\" aria-label=\"لوحة أطراف\" direction=\"ltr\" style=\"direction:ltr\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"25\" cy=\"22\" r=\"6\"/><text x=\"25\" y=\"10\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">U1</text><circle cx=\"65\" cy=\"22\" r=\"6\"/><text x=\"65\" y=\"10\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">V1</text><circle cx=\"105\" cy=\"22\" r=\"6\"/><text x=\"105\" y=\"10\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">W1</text><circle cx=\"25\" cy=\"54\" r=\"6\"/><text x=\"25\" y=\"74\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">W2</text><circle cx=\"65\" cy=\"54\" r=\"6\"/><text x=\"65\" y=\"74\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">U2</text><circle cx=\"105\" cy=\"54\" r=\"6\"/><text x=\"105\" y=\"74\" text-anchor=\"middle\" fill=\"currentColor\" stroke=\"none\" font-size=\"11\" font-family=\"sans-serif\" font-weight=\"normal\">V2</text><line x1=\"25\" y1=\"28\" x2=\"25\" y2=\"48\" stroke-width=\"4\"/><line x1=\"65\" y1=\"28\" x2=\"65\" y2=\"48\" stroke-width=\"4\"/><line x1=\"105\" y1=\"28\" x2=\"105\" y2=\"48\" stroke-width=\"4\"/></svg><br>ما التوصيلة؟",
     "b": "مثلث: ثلاث قناطر رأسية U1–W2 و V1–U2 و W1–V2، أي بداية كل وجه مع نهاية الوجه الذي قبله.",
     "ref": "ص 121"
    }
   ]
  },
  "u6": {
   "title": "دوائر البدء والتحكم في السرعة",
   "cards": [
    {
     "k": "def",
     "f": "تغيير السرعة ميكانيكياً",
     "b": "بتركيب مجموعة مسننات في المحرك، غير قابلة للضبط أو قابلة للضبط تدريجياً.",
     "ref": "ص 129"
    },
    {
     "k": "def",
     "f": "مقاومة البدء لمحرك التيار المستمر",
     "b": "مقاومة ملفات عضو الاستنتاج صغيرة جداً، فتوصل مقاومة على التوالي معها ثم يطبق الجهد، وتنقص كلما ارتفعت السرعة.",
     "ref": "ص 129"
    },
    {
     "k": "def",
     "f": "تيار البدء",
     "b": "التيار الأقصى الذي يمر بمجرد إغلاق مفتاح القدرة للمحرك.",
     "ref": "ص 129"
    },
    {
     "k": "def",
     "f": "مقاومة بدء متغيرة وثابتة",
     "b": "المتغيرة تُقلل تدريجياً أثناء زيادة السرعة (6-1-أ)، والثابتة تُقصر بتلامس على التوازي معها بعد زيادة السرعة (6-1-ب).",
     "ref": "ص 129–130"
    },
    {
     "k": "def",
     "f": "طرق التحكم في سرعة محرك التيار المستمر",
     "b": "تغيير الفيض المغناطيسي (منظم المجال)، أو مقاومة التوالي مع العضو الدائر، أو جهد عضو الإنتاج.",
     "ref": "ص 131"
    },
    {
     "k": "law",
     "f": "إضعاف المجال وتقليل جهد العضو",
     "b": "إضعاف المجال يرفع السرعة فوق الاسمية (6-5). مقاومات على التوالي مع العضو (تقليل جهده) تخفضها تحت الاسمية (6-6).",
     "ref": "ص 132–133"
    },
    {
     "k": "def",
     "f": "تبديل أطراف التوصيل الخارجية",
     "b": "إذا بدلت أطراف التوصيل الخارجية لمحرك تيار مستمر يظل يدور في نفس الاتجاه (6-3)؛ ويعكس الاتجاه بتغيير قطبية عضو الإنتاج (6-4).",
     "ref": "ص 131"
    },
    {
     "k": "def",
     "f": "بادئ العضو الساكن للمحرك الحثي",
     "b": "مقاومة على التوالي مع كل ملفات وجه عند الوصل؛ المتغيرة تقلل أثناء زيادة السرعة، والثابتة تقصر بعدها.",
     "ref": "ص 133"
    },
    {
     "k": "def",
     "f": "البدء نجمة/مثلث",
     "b": "للمحرك الذي توصيلته في التشغيل المستقر مثلث: يبدأ نجمة حتى تزيد السرعة وينخفض التيار، ثم يوصل مثلثاً.",
     "ref": "ص 134"
    },
    {
     "k": "symbol",
     "f": "وصلات المثلث الصحيحة في البادئ",
     "b": "W2 ← U1 (L1) · U2 ← V1 (L2) · V2 ← W1 (L3). في الشكل (6-9) كما في الكتاب: V2 ← L2 و U2 ← L3 فيقصر الملف V (ملاحظة الدرس).",
     "ref": "ص 134–135"
    },
    {
     "k": "def",
     "f": "بدء محرك حلقات الانزلاق",
     "b": "مقاومة تضاف على ملفات العضو الدوار عند البدء: يصغر تيار البدء ويكبر عزم البدء (6-10).",
     "ref": "ص 135"
    },
    {
     "k": "def",
     "f": "عكس اتجاه المحرك الحثي الثلاثي",
     "b": "بتبديل طرفي أي موصلين خارجيين (6-11).",
     "ref": "ص 137"
    },
    {
     "k": "def",
     "f": "المفتاح المساعد S3 (التمرين 4)",
     "b": "على بادئ التشغيل: يمنع توصيل الإدارة إذا لم يكن البادئ في وضعه الأولي.",
     "ref": "ص 140"
    }
   ]
  },
  "u7": {
   "title": "مخططات نظم القوى وعناصر حمايتها",
   "cards": [
    {
     "k": "def",
     "f": "مكونات محطة المحولات (7-1)",
     "b": "شبكة جهد عالٍ ← مفتاح الفصل ← مفتاح قدرة الجهد العالي ← محول الخفض ← مفتاح قدرة الجهد المنخفض ← شبكة الجهد المنخفض.",
     "ref": "ص 144"
    },
    {
     "k": "symbol",
     "f": "13.8 kV ± 4% · 100 kVA · 400/231 V",
     "b": "بيانات محول الخفض في محطة (7-1)، بتردد 60 Hz. وشبكة الجهد العالي 13.8 kV ثلاثة أوجه.",
     "ref": "ص 144"
    },
    {
     "k": "def",
     "f": "مفتاح الفصل",
     "b": "يُشغَّل (يفتح أو يغلق) فقط والدائرة بلا تيار، أي بعد فتح مفتاح القدرة.",
     "ref": "ص 144"
    },
    {
     "k": "def",
     "f": "القواطع عبر محولات التيار",
     "b": "في الجهد العالي بسبب الجهد العالي، وفي الجهد المنخفض بسبب التيارات العالية، توصل قواطع التيار الزائد ودائرة القصر عبر محولات التيار.",
     "ref": "ص 144"
    },
    {
     "k": "def",
     "f": "الشبكة الانتقائية",
     "b": "يُفصل الجزء الذي حدث عنده القصر وحده. أبطأ المفاتيح قبل المحول وأسرعها في موصل المستهلك.",
     "ref": "ص 147"
    },
    {
     "k": "symbol",
     "f": "180 ms · 120 ms · 60 ms",
     "b": "التدرج الزمني في الشكل (7-4) من المحول نحو المستهلك؛ والمفتاح محدد التيار عند المستهلك أسرع (لحظي).",
     "ref": "ص 148–149"
    },
    {
     "k": "def",
     "f": "وقاية المحركات",
     "b": "بالمصهرات ومفاتيح الوقاية والمرحلات، حسب حجم المحرك وطبيعة الحمل الميكانيكي.",
     "ref": "ص 149"
    },
    {
     "k": "def",
     "f": "الحراري والمغناطيسي في مفتاح وقاية المحرك",
     "b": "يُضبط على التيار الاسمي ويفصل بعد بعض الوقت عند تجاوزه (حراري)؛ والقواطع المغناطيسية السريعة تحمي عند القصر.",
     "ref": "ص 149"
    },
    {
     "k": "def",
     "f": "مفتاح وقاية بدون فصل مغناطيسي سريع",
     "b": "حراري فقط، فتوصل مصهرات على التوالي لوقاية المحرك والموصل من القصر.",
     "ref": "ص 150"
    },
    {
     "k": "law",
     "f": "المرحل الفرقي",
     "b": "يعمل عندما \\(\\Delta I=I_1-I_2\\ne0\\): عطل داخل منطقة الحماية. القصر خارجها يمر في الجهتين فيبقى الفرق صفراً.",
     "ref": "ص 154"
    },
    {
     "k": "def",
     "f": "متمم الوقاية بالاتزان",
     "b": "أطراف المحول الابتدائية والثانوية تمر في حلقة حديدية متزنة عادة؛ تأريض وجه أو قصر بين وجهين يخل الاتزان فيتولد تيار يشغل المتمم فيفصل المفتاح.",
     "ref": "ص 155"
    },
    {
     "k": "def",
     "f": "أخطاء المولد الخارجية",
     "b": "قصر في دائرة الحمل، زيادة الحمل، عدم اتزان الحمل على الأوجه، انعكاس القدرة.",
     "ref": "ص 156"
    },
    {
     "k": "def",
     "f": "أخطاء المولد الداخلية",
     "b": "قصر بين أوجه العضو الثابت أو بين ملفات الوجه الواحد، تماس العضو الثابت بالأرض، ارتفاع حرارة هواء التبريد، احتراق العضو الثابت.",
     "ref": "ص 156–157"
    },
    {
     "k": "def",
     "f": "متممات وقاية المولد",
     "b": "الفرقي ضد الأخطار الداخلية، والاتزان الحلقي ضد التسرب الأرضي أو القصر، والحراري ضد زيادة الحمل.",
     "ref": "ص 157"
    },
    {
     "k": "def",
     "f": "وقاية مجموعة المولد والمحول (7-11)",
     "b": "محولات تيار على بدايات ونهايات أوجه المولد والمحول توصل معاً بالتضاد؛ الخلل داخل المجموعة يجعل المتمم الفرقي يفصلها كلياً.",
     "ref": "ص 157"
    },
    {
     "k": "def",
     "f": "مفتاح وقاية الموصلات",
     "b": "مفتاح قابض بفصل حراري (التحميل الزائد) وفصل كهرومغناطيسي (القصر). ليس مفتاح أجهزة: لا يستعمل للوصل والفصل الاعتيادي. وفي (7-12) 16 A.",
     "ref": "ص 159"
    }
   ]
  }
 },
 "lessons": {
  "u1-l1": {
   "order": [
    {
     "title": "رتّب خطوات رسم دائرة بالفرجار كما في الكتاب",
     "steps": [
      "افتح ساقي الفرجار مسافة تساوي نصف قطر الدائرة",
      "أمسك ذراع الفرجار الحامل للإبرة وثبّت الإبرة في محور الدائرة",
      "ابدأ من مكان معين وتحرك في اتجاه عقرب الساعة بخط خفيف",
      "راجع مقاس الدائرة المرسومة",
      "أعد رسم الدائرة بخط داكن"
     ]
    },
    {
     "title": "رتّب مراحل العمل بالقلم على لوحة الرسم",
     "steps": [
      "ارسم الخطوط الإنشائية بقلم 2H رفيعة وخفيفة جداً",
      "تأكد من صحة الرسم",
      "امحُ الخطوط الزائدة",
      "غمّق جميع الخطوط بالسمك المناسب لنوعها"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل قلم باستعماله",
     "pairs": [
      [
       "2H",
       "الخطوط الإنشائية العامة (خفيف سهل المسح)"
      ],
      [
       "HB",
       "تشطيب الرسم والكتابة (معتدل الظل)"
      ],
      [
       "2B",
       "تثبيت الرسم النهائي (غامق يترك أثراً)"
      ]
     ]
    },
    {
     "title": "وصّل كل مقاس ورق بأبعاده",
     "pairs": [
      [
       "A4",
       "297 × 210 mm"
      ],
      [
       "A3",
       "420 × 297 mm"
      ],
      [
       "A2",
       "594 × 420 mm"
      ],
      [
       "A1",
       "841 × 594 mm"
      ],
      [
       "A0",
       "1189 × 841 mm"
      ]
     ]
    }
   ]
  },
  "u1-l2": {
   "order": [
    {
     "title": "رتّب مراحل تبعيد الطبعة كما في أشكال ص 16",
     "steps": [
      "ارسم حواف القطعة بالخطوط الكاملة العريضة",
      "ارسم الخطوط المساعدة (خطوط الإسناد) عمودية على الحواف",
      "ارسم خطوط الأبعاد وأسهمها المصمتة",
      "اكتب أرقام الأبعاد في فراغ كتابة الأبعاد"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل قاعدة بقيمتها",
     "pairs": [
      [
       "أقل طول للخط المساعد (بعد واحد)",
       "10 mm"
      ],
      [
       "بعد خط البعد عن حافة الشكل",
       "8 mm تقريباً"
      ],
      [
       "أقل مسافة بين خطي بعدين متوازيين",
       "5 mm"
      ],
      [
       "ارتفاع أرقام الأبعاد (DIN 16)",
       "نحو 4 mm"
      ]
     ]
    }
   ]
  },
  "u1-l3": {
   "match": [
    {
     "title": "وصّل كل مسقط باتجاه النظر وموضعه",
     "pairs": [
      [
       "المسقط الرأسي",
       "اتجاه النظر E — المسقط الأساسي"
      ],
      [
       "المسقط الأفقي",
       "بالنظر من أعلى P — يرسم أسفل الرأسي تماماً"
      ],
      [
       "المسقط الجانبي",
       "بالنظر من اليسار S — يرسم يمين الرأسي وعلى مستواه"
      ]
     ]
    },
    {
     "title": "وصّل وضع السطح بطريقة ظهوره في المسقط",
     "pairs": [
      [
       "سطح موازٍ لمستوى الإسقاط",
       "يظهر بشكله وأبعاده الحقيقية"
      ],
      [
       "سطح عمودي على مستوى الإسقاط",
       "يظهر حافة (خطاً مستقيماً)"
      ],
      [
       "سطح مائل على مستوى الإسقاط",
       "لا يظهر بأبعاده الحقيقية وتعرف من مسقطين"
      ]
     ]
    }
   ]
  },
  "u1-l4": {
   "order": [
    {
     "title": "رتّب خطوات استنتاج المسقط الجانبي بخط 45°",
     "steps": [
      "انقل النقطة 1 من المسقط الرأسي بمدّ خط أفقي منها نحو اليمين",
      "ارسم خطاً مساعداً يميل 45° من الركن الأيمن السفلي للمسقط الرأسي",
      "انقل النقطة 1 من المسقط الأفقي إلى الخط المساعد بمدّ خط أفقي منها",
      "من الخط المساعد ارسم خطاً رأسياً يقطع الخط الأول في النقطة 1 في المسقط الجانبي",
      "كرر مع باقي الأركان ثم صل النقاط"
     ]
    },
    {
     "title": "رتّب خطوات استنتاج المسقط الأفقي بالفرجار",
     "steps": [
      "ارسم خطين مساعدين يبعدان مسافة a عن المسقطين الرأسي والجانبي؛ تقاطعهما مركز الفرجار",
      "انقل النقطة 1 من المسقط الرأسي برسم خط رأسي منها",
      "انقل النقطة 1 من المسقط الجانبي إلى الخط المساعد برسم خط رأسي منها",
      "انقلها إلى الخط المساعد الآخر بالدوران بالفرجار",
      "ارسم خطاً أفقياً من نقطة التقاطع يقطع الخط الرأسي في النقطة 1 في المسقط الأفقي"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل طريقة بالمسقط الذي استنتجه بها مثال الكتاب",
     "pairs": [
      [
       "نقل الحواف من المسقطين الجانبي والأفقي",
       "المسقط الرأسي (ص 21)"
      ],
      [
       "الانعكاس على خط مساعد 45°",
       "المسقط الجانبي (ص 22)"
      ],
      [
       "النقل بالفرجار",
       "المسقط الأفقي (ص 23)"
      ]
     ]
    }
   ]
  },
  "u1-l5": {
   "match": [
    {
     "title": "وصّل كل نوع خط باستعماله",
     "pairs": [
      [
       "خط كامل عريض",
       "الحواف الظاهرة"
      ],
      [
       "خط متقطع بنصف الثخانة",
       "الحواف المختفية"
      ],
      [
       "شرطة ونقطة بنصف الثخانة",
       "خط المنتصف (محور التماثل)"
      ],
      [
       "خط كامل رفيع",
       "خطوط الأبعاد والخطوط المساعدة"
      ]
     ]
    }
   ]
  },
  "u1-l6": {
   "match": [
    {
     "title": "وصّل كل حالة بطريقة وضع بعدها",
     "pairs": [
      [
       "زاوية مكتوبة بالدرجات",
       "خط البعد قوس مركزه رأس الزاوية"
      ],
      [
       "ارتفاع المثلث هو البعد الهام",
       "البعد موازٍ للارتفاع h"
      ],
      [
       "طول ضلع المثلث هو البعد الهام",
       "البعد موازٍ للضلع s"
      ],
      [
       "أنصاف أقطار متساوية في قطعة واحدة",
       "يُكتب نصف قطر إحداها فقط"
      ],
      [
       "مكان ضيق لسهم نصف القطر",
       "يرسم السهم من الخارج ليلامس رأسه القوس"
      ]
     ]
    }
   ]
  },
  "u1-l7": {
   "order": [
    {
     "title": "رتّب خطوات تشغيل المشغولة الأسطوانية (ص 38–39)",
     "steps": [
      "تحديد المركز ثم الثقب",
      "خراطة العمود",
      "تشغيل الانحسار",
      "قطع المشغولة بالطول المطلوب"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل جزء من رمز القطر ϕ بقاعدته",
     "pairs": [
      [
       "دائرة الرمز",
       "حجمها يعادل حرف الكتابة الصغير"
      ],
      [
       "الخط المائل",
       "يمر بالمركز ويميل 75° عن الأفقي"
      ],
      [
       "الارتفاع الكلي للرمز",
       "يساوي ارتفاع أرقام القطر"
      ],
      [
       "موضع الرمز",
       "على يسار الرقم"
      ]
     ]
    }
   ]
  },
  "u1-l8": {
   "match": [
    {
     "title": "وصّل كل نوع قطاع بوصفه",
     "pairs": [
      [
       "قطاع كامل",
       "الجسم مقطوع كله بمستوى يمر بالمحور"
      ],
      [
       "نصف قطاع",
       "نصف منظر خارجي ونصف مقطوع يفصلهما خط المنتصف"
      ],
      [
       "قطاع جزئي",
       "جزء فقط مقطوع يحده خط كسر حر متعرج"
      ]
     ]
    }
   ]
  },
  "u2-l1": {
   "match": [
    {
     "title": "وصّل كل رمز تنفيذي بالعنصر",
     "pairs": [
      [
       "دائرة بداخلها G وتحتها ~",
       "مصدر تيار متردد"
      ],
      [
       "دائرة بداخلها A بطرفين",
       "مقياس تيار (أمبيرميتر)"
      ],
      [
       "مستطيل بداخله KWh و 3~",
       "عداد ثلاثي الوجه"
      ],
      [
       "ملامس قلاب بطرف مشترك وطرفين",
       "مفتاح طرف سلم"
      ],
      [
       "مشغّل ضغط بلا رمز حجز وملامس مفتوح",
       "ضاغط"
      ],
      [
       "ملف وملامس مفتوح بينهما وصلة منقطة",
       "مفتاح صدمة تيار"
      ]
     ]
    },
    {
     "title": "وصّل كل قاطع في الطبلون ثلاثي الأوجه بطوره (ص 51)",
     "pairs": [
      [
       "القاطعان 4 و 10",
       "L1"
      ],
      [
       "القاطعان 5 و 11",
       "L2"
      ],
      [
       "القاطعان 6 و 12",
       "L3"
      ]
     ]
    }
   ]
  },
  "u2-l2": {
   "match": [
    {
     "title": "وصّل كل وصف رمز بالعنصر",
     "pairs": [
      [
       "دايود فوقه سهمان داخلان",
       "دايود ضوئي"
      ],
      [
       "دايود فوقه سهمان خارجان",
       "دايود مشع"
      ],
      [
       "مثلثان متعاكسان بين خطين بلا بوابة",
       "داياك"
      ],
      [
       "سهم الباعث داخل نحو القاعدة",
       "ترانزستور PNP"
      ],
      [
       "مستطيل بداخله & ودائرة نفي على الخرج",
       "بوابة NAND"
      ],
      [
       "مستطيل بداخله ≥1 بلا دائرة نفي",
       "بوابة OR"
      ]
     ]
    }
   ]
  },
  "u2-l3": {
   "match": [
    {
     "title": "وصّل كل رمز بالعنصر",
     "pairs": [
      [
       "مثلث صغير على الوصلة ⊲",
       "رجوع تلقائي"
      ],
      [
       "خط منقط ينتهي برمز حجز ∨",
       "بدون رجوع تلقائي (يبقى على وضعه)"
      ],
      [
       "مربع مقسم إلى أربعة ⊞ على الوصلة",
       "قفل تشغيل"
      ],
      [
       "ملف على الوصلة",
       "تشغيل كهرومغناطيسي"
      ],
      [
       "مستطيل بداخله I<",
       "قاطع ضد التيار المنخفض"
      ],
      [
       "مستطيل بداخله U<",
       "قاطع عند الجهد المنخفض"
      ]
     ]
    }
   ]
  },
  "u2-l4": {
   "match": [
    {
     "title": "وصّل كل زوج أطراف بملفه",
     "pairs": [
      [
       "A1–A2",
       "العضو الدوار (المنتج) لآلة التيار المستمر"
      ],
      [
       "F1–F2",
       "مجال منفصل التغذية"
      ],
      [
       "E1–E2",
       "مجال التوازي"
      ],
      [
       "D1–D2",
       "مجال التوالي"
      ],
      [
       "Z1–Z2",
       "الملف المساعد للمحرك أحادي الوجه"
      ]
     ]
    },
    {
     "title": "وصّل كل رمز رمزي بالمحول",
     "pairs": [
      [
       "دائرتان متداخلتان",
       "محول أحادي الوجه بملفين منفصلين"
      ],
      [
       "دائرة واحدة بقوس على طرفها العلوي",
       "محول ذاتي"
      ],
      [
       "دائرتان فيهما ⅄ و Δ",
       "محول ثلاثي نجمة/دلتا"
      ],
      [
       "موصل يمر بدائرة وبجانبها قوس",
       "محول تيار"
      ]
     ]
    }
   ]
  },
  "u3-l1": {
   "order": [
    {
     "title": "رتّب خطوات رسم مخطط بيان التوصيلات الكهربائية",
     "steps": [
      "تجهيز رسم المسقط الأفقي للمبنى",
      "تحديد مواضع المقابس والنوع والكمية",
      "تحديد مواضع المفاتيح",
      "تحديد موضع لوحة التوزيع",
      "تحديد أماكن المقابس",
      "تحديد عدد الدوائر الفرعية",
      "تحديد مساحة مقطع الكابل"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل خطوة بأساسها",
     "pairs": [
      [
       "مواضع المقابس",
       "أنواع الأجهزة وشدة الإضاءة ومساحة الغرف"
      ],
      [
       "مواضع المفاتيح",
       "أنسب الأماكن، وتركب على مستوى واحد"
      ],
      [
       "موضع لوحة التوزيع",
       "مواضع المقابس ومركز الأحمال والزيادة المحسوبة للحمل"
      ],
      [
       "عدد الدوائر الفرعية",
       "استخدام القوابس وعدد الغرف والسعة المسموحة والأمان"
      ],
      [
       "مقطع الكابل",
       "يتحمل تيار الحمل الذي يغذيه بأمان"
      ]
     ]
    }
   ]
  },
  "u3-l2": {
   "order": [
    {
     "title": "رتّب مسار التيار في دائرة المصباحين على التوازي (3-3) ب",
     "steps": [
      "L1",
      "المفتاح المفرد",
      "العقدة في علبة التفريع",
      "المصباحان (على التوازي)",
      "N"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل موصل في الشكل (3-3) ب بنمطه ووظيفته",
     "pairs": [
      [
       "L1",
       "خط متصل — يغذي المفتاح"
      ],
      [
       "N",
       "شرطة-نقطة — الطرف الآخر للمصباحين"
      ],
      [
       "PE",
       "خط متقطع — جسم كل كشاف (الأرضي)"
      ]
     ]
    }
   ]
  },
  "u3-l3": {
   "order": [
    {
     "title": "رتّب مسار التيار في كشاف الفلورسنت (3-5) ب عند البدء",
     "steps": [
      "L1",
      "المفتاح",
      "الملف الخانق",
      "الفتيلة اليمنى",
      "البادئ",
      "الفتيلة اليسرى",
      "N"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل مفتاح في دائرة السلم (3-4) بعدد أسلاكه",
     "pairs": [
      [
       "كل مفتاح ذي اتجاهين (في الطرفين)",
       "3 أسلاك على خطه"
      ],
      [
       "المفتاح الوسطي",
       "4 أسلاك على خطه"
      ],
      [
       "بين كل مفتاحين متجاورين",
       "سلكان مسافران"
      ],
      [
       "من مشترك المفتاح الأخير",
       "الخط المُشغَّل إلى المصابيح"
      ]
     ]
    }
   ]
  },
  "u3-l4": {
   "match": [
    {
     "title": "وصّل كل عنصر في دائرة الجرس بموضعه",
     "pairs": [
      [
       "الضاغط في (3-7)",
       "على L1 قبل الجرس"
      ],
      [
       "الضاغط في (3-8)",
       "على جانب الملف الابتدائي"
      ],
      [
       "الجرس في (3-8)",
       "على طرفي الملف الثانوي فقط"
      ],
      [
       "محول الجرس",
       "يخفض الجهد إلى 12 أو 24 فولت"
      ]
     ]
    }
   ]
  },
  "u3-l5": {
   "match": [
    {
     "title": "وصّل كل طرف في مفتاح صدمة التيار (3-9) بدائرته",
     "pairs": [
      [
       "الملف A1–A2",
       "دائرة التحكم مع الضواغط"
      ],
      [
       "التلامس 1–2",
       "دائرة القدرة مع المصابيح"
      ],
      [
       "الضواغط الثلاثة",
       "على التوازي في دائرة التحكم"
      ]
     ]
    },
    {
     "title": "وصّل كل طرف من أطراف المزمن (3-10) ب بما يتصل به",
     "pairs": [
      [
       "الطرفان 1 و 2",
       "L1"
      ],
      [
       "الطرف 3",
       "المصابيح"
      ],
      [
       "الطرف 7",
       "الضواغط"
      ]
     ]
    }
   ]
  },
  "u3-l6": {
   "match": [
    {
     "title": "وصّل كل دائرة في الوحدة السكنية بحمايتها (النص ص 77)",
     "pairs": [
      [
       "الدائرة 1: محرك ثلاثي 2.2 kW",
       "3 مصاهر 20 A"
      ],
      [
       "الدائرة 2: مصابيح",
       "مفتاح وقاية 10 A"
      ],
      [
       "الدائرة 3: مقابس",
       "مفتاح وقاية 20 A"
      ],
      [
       "الدائرة 5: فرن 7.5 kW",
       "ثلاثة مفاتيح وقاية 35 A"
      ],
      [
       "الدائرة 6: سخان 4 kW",
       "ثلاثة مفاتيح وقاية 20 A"
      ]
     ]
    }
   ]
  },
  "u4-l1": {
   "match": [
    {
     "title": "وصّل كل مفتاح في الشكل (4-1) بوظيفته",
     "pairs": [
      [
       "(أ)",
       "وقاية المحول وموصل الموزع الرئيس، ويفصل المنشأة كلها"
      ],
      [
       "(ب)",
       "وقاية موصل تغذية الموزع الفرعي والموزع الفرعي"
      ],
      [
       "(جـ)",
       "فصل الموزع الفرعي (في مدخله)"
      ],
      [
       "(د)",
       "وقاية موصل تغذية موزع الأحمال وموزع الأحمال"
      ],
      [
       "(هـ)",
       "فصل موزع الأحمال (في مدخل موزع المستهلك)"
      ],
      [
       "(و)",
       "تجهيزات لوقاية الموصلات والأجهزة"
      ]
     ]
    }
   ]
  },
  "u4-l3": {
   "match": [
    {
     "title": "وصّل كل عنصر في لوحة توزيع القوى للمصنع بقيمته",
     "pairs": [
      [
       "اللوحة كلها",
       "1000 A بثلاث خلايا"
      ],
      [
       "فولتميتر خلية الدخول",
       "400 فولت"
      ],
      [
       "أميترات خلية الدخول",
       "ثلاثة سعة 600 أمبير"
      ],
      [
       "مفاتيح خلية الخروج",
       "أربعة باك سويتش 100 أمبير"
      ],
      [
       "مصاهر خلية الخروج",
       "اثنا عشر مصهراً 36 أمبير"
      ]
     ]
    }
   ]
  },
  "u4-l4": {
   "match": [
    {
     "title": "وصّل كل عنصر في لوحة إضاءة الورشة (ص 92) بقيمته",
     "pairs": [
      [
       "المفتاح الأوتوماتيكي الرئيس",
       "وجه واحد 20 A 220 V"
      ],
      [
       "المصاهر",
       "ثلاثة 220 V 5 A"
      ],
      [
       "مفاتيح الخروج",
       "خمسة أوتوماتيكية 5 A 220 V"
      ],
      [
       "أبعاد اللوحة",
       "80 × 80 سم وعرض 40 سم"
      ]
     ]
    }
   ]
  },
  "u4-l5": {
   "match": [
    {
     "title": "وصّل كل مفتاح في التمرين (1) بما يخدمه",
     "pairs": [
      [
       "Q1",
       "مفتاح قدرة أوتوماتيكي للمحول T1"
      ],
      [
       "Q2",
       "مفتاح قدرة أوتوماتيكي للمحول T2"
      ],
      [
       "Q3",
       "أوتوماتيكي للموزع الفرعي الأول"
      ],
      [
       "Q6",
       "مفتاح قدرة (فصل) للموزع الفرعي الثاني"
      ],
      [
       "Q7",
       "أوتوماتيكي لموزع المستهلك (الإضاءة)"
      ],
      [
       "Q10",
       "مفتاح قدرة لموزع المستهلك (القدرة)"
      ]
     ]
    }
   ]
  },
  "u5-l1": {
   "match": [
    {
     "title": "وصّل كل تغيير في محرك منفصل التغذية بنتيجته",
     "pairs": [
      [
       "عكس A1 و A2 وحدهما",
       "ينعكس الدوران ويصبح A1 سالباً"
      ],
      [
       "عكس F1 و F2 وحدهما",
       "ينعكس الدوران وقطبية A1 كما هي"
      ],
      [
       "عكس العضو والمجال معاً",
       "يبقى الاتجاه كما هو"
      ],
      [
       "الدوران إلى اليمين",
       "A1 موجب"
      ]
     ]
    }
   ]
  },
  "u5-l2": {
   "match": [
    {
     "title": "وصّل كل طرف في لوحة أطراف محرك التوالي (5-5) بما يتصل به",
     "pairs": [
      [
       "A1",
       "طرف العضو الدوار — يأخذ التغذية"
      ],
      [
       "A2",
       "يتصل بـ D1 بالقنطرة"
      ],
      [
       "D1",
       "بداية ملف التوالي — قنطرة إلى A2"
      ],
      [
       "D2",
       "نهاية ملف التوالي — يأخذ التغذية"
      ]
     ]
    }
   ]
  },
  "u5-l3": {
   "match": [
    {
     "title": "وصّل كل جزء في محرك التوازي مع مفتاح الوقاية بعمله",
     "pairs": [
      [
       "القنطرة A1–E1",
       "تضع بداية المجال مع بداية العضو"
      ],
      [
       "القنطرة E2–A2",
       "تغلق المجال على العضو (توازٍ)"
      ],
      [
       "المرحل الحراري",
       "يفصل بعد مدة عند زيادة الحمل"
      ],
      [
       "المرحل المغناطيسي I>",
       "يفصل فوراً عند القصر"
      ],
      [
       "القنطرة 3–5 في المفتاح",
       "تمرر السالب في قطبين متتاليين"
      ]
     ]
    }
   ]
  },
  "u5-l4": {
   "match": [
    {
     "title": "وصّل كل ملف في المحرك المركب بموضعه",
     "pairs": [
      [
       "ملف التوازي E1–E2",
       "على أطراف التغذية"
      ],
      [
       "ملف التوالي D1–D2",
       "في مسار العضو الدوار"
      ],
      [
       "قصر ملف التوالي بقنطرة D1–D2",
       "يعمل المحرك كمحرك توازٍ"
      ]
     ]
    }
   ]
  },
  "u5-l5": {
   "match": [
    {
     "title": "وصّل كل جهاز في دائرة المولد التزامني (5-14) بطريقة توصيله أو عمله",
     "pairs": [
      [
       "الأميتر",
       "على التوالي في الخط"
      ],
      [
       "الفولتميتر",
       "على التوازي بين الخطين: يقيس الجهد"
      ],
      [
       "مقياس التردد",
       "على التوازي بجانب الفولتميتر: يقيس Hz"
      ],
      [
       "المقاومة المتغيرة في دائرة التيار المستمر",
       "تنظم تيار التنبيه فيتغير الجهد"
      ],
      [
       "حلقات الانزلاق والفرش",
       "توصل التيار المستمر إلى الأقطاب الدوارة"
      ]
     ]
    }
   ]
  },
  "u5-l6": {
   "match": [
    {
     "title": "وصّل كل عنصر في دوائر المولد ثلاثي الأوجه بوظيفته",
     "pairs": [
      [
       "محول الجهد",
       "يخفض الجهد لأجهزة القياس"
      ],
      [
       "محولات التيار",
       "تخفض التيار لأجهزة القياس"
      ],
      [
       "محول القدرة في (5-16)",
       "يرفع الجهد من 3.3 kV إلى 33 kV"
      ],
      [
       "نقطة النجمة",
       "يخرج منها الخط N"
      ]
     ]
    }
   ]
  },
  "u5-l7": {
   "match": [
    {
     "title": "وصّل كل نوع محرك أحادي الوجه بميزته",
     "pairs": [
      [
       "مكثف تشغيل مستمر",
       "معامل قدرة جيد"
      ],
      [
       "مكثف بدء التشغيل",
       "عزم دوران بدئي جيد"
      ],
      [
       "مكثف بدء ومكثف تشغيل",
       "معامل قدرة جيد عند عزم بدء عالٍ"
      ],
      [
       "قطب مظلل",
       "حلقة نحاسية مقصورة في مجرى القطب"
      ]
     ]
    }
   ]
  },
  "u5-l8": {
   "match": [
    {
     "title": "وصّل كل بداية وجه بالطرف الذي تقنطر معه في المثلث",
     "pairs": [
      [
       "U1",
       "W2"
      ],
      [
       "V1",
       "U2"
      ],
      [
       "W1",
       "V2"
      ]
     ]
    }
   ]
  },
  "u6-l1": {
   "order": [
    {
     "title": "رتّب بدء محرك التيار المستمر بمقاومة البدء",
     "steps": [
      "صل مقاومة البدء كاملة على التوالي مع عضو الاستنتاج",
      "طبّق الجهد بإغلاق مفتاح القدرة (يمر تيار البدء)",
      "أنقص المقاومة كلما ارتفعت سرعة الدوران",
      "اقصر مقاومة البدء بعد زيادة السرعة"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل طريقة بأثرها في سرعة محرك التيار المستمر",
     "pairs": [
      [
       "إضعاف المجال (6-5)",
       "سرعة أكبر من الاسمية"
      ],
      [
       "مقاومات على التوالي مع العضو (6-6)",
       "سرعة أقل من الاسمية"
      ],
      [
       "تبديل سلكي التغذية الخارجيين",
       "يبقى اتجاه الدوران"
      ],
      [
       "عكس قطبية عضو الإنتاج",
       "ينعكس اتجاه الدوران"
      ]
     ]
    }
   ]
  },
  "u6-l2": {
   "order": [
    {
     "title": "رتّب بدء المحرك الحثي ببادئ نجمة/مثلث",
     "steps": [
      "ضع مفتاح البادئ على وضع النجمة",
      "شغّل المحرك (يأخذ كل ملف جهد الوجه)",
      "انتظر حتى تزيد السرعة وينخفض التيار إلى قيمة مناسبة",
      "انقل المفتاح إلى وضع المثلث"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل طريقة بدء بالمحرك أو الفكرة",
     "pairs": [
      [
       "مقاومات على التوالي مع ملفات العضو الساكن",
       "بادئ العضو الساكن (6-7 و 6-8)"
      ],
      [
       "نجمة ثم مثلث",
       "محرك توصيلته في التشغيل المستقر مثلث"
      ],
      [
       "مقاومات على ملفات العضو الدوار",
       "محرك حلقات الانزلاق (تيار أصغر وعزم أكبر)"
      ],
      [
       "تبديل طرفي أي موصلين خارجيين",
       "عكس اتجاه الدوران"
      ]
     ]
    }
   ]
  },
  "u6-l3": {
   "match": [
    {
     "title": "وصّل كل تمرين بمحركه",
     "pairs": [
      [
       "التمرين (١)",
       "تيار مستمر توالٍ 220 V يدور يميناً"
      ],
      [
       "التمرين (٢)",
       "تيار مستمر مزدوج الاستثارة 220 V يدور يساراً"
      ],
      [
       "التمرين (٣)",
       "مزدوج الاستثارة ببادئ ريوستاتي وتأريض وقائي"
      ],
      [
       "التمرين (٤)",
       "ثلاثي بحلقات انزلاق 380 V ومفتاح مساعد S3"
      ]
     ]
    }
   ]
  },
  "u7-l1": {
   "order": [
    {
     "title": "رتّب مكونات محطة المحولات (7-1) من الجهد العالي إلى المنخفض",
     "steps": [
      "شبكة الجهد العالي 13.8 kV",
      "مفتاح الفصل",
      "مفتاح قدرة الجهد العالي",
      "محول الخفض 100 kVA",
      "مفتاح قدرة الجهد المنخفض",
      "شبكة الجهد المنخفض 220/380 V"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل مكوّن بما يذكره الكتاب عنه",
     "pairs": [
      [
       "مفتاح الفصل",
       "يُشغَّل والدائرة بلا تيار فقط"
      ],
      [
       "مفتاح قدرة الجهد العالي",
       "قواطعه عبر محولات التيار بسبب الجهد العالي"
      ],
      [
       "مفتاح قدرة الجهد المنخفض",
       "قواطعه عبر محولات التيار بسبب التيارات العالية"
      ],
      [
       "محول الخفض",
       "13.8 kV ± 4% إلى 400/231 V"
      ]
     ]
    }
   ]
  },
  "u7-l2": {
   "order": [
    {
     "title": "رتّب مكونات الشبكة الشعاعية من المحول إلى المستهلك (ص 147)",
     "steps": [
      "المحول",
      "مفتاح القدرة الأوتوماتيكي (1)",
      "الموزع الرئيس",
      "مفتاح القدرة الأوتوماتيكي (2)",
      "مفتاح القدرة في مدخل الموزع الفرعي",
      "الموزع الفرعي",
      "مفتاح القدرة الأوتوماتيكي (3)",
      "موزع المستهلك"
     ]
    }
   ],
   "match": [
    {
     "title": "وصّل كل مفتاح في الشكل (7-4) بزمن تأخيره",
     "pairs": [
      [
       "المفتاح 1 (بعد المحول)",
       "180 ms"
      ],
      [
       "المفتاح 2",
       "120 ms"
      ],
      [
       "المفتاح 3",
       "60 ms"
      ],
      [
       "المفتاح 4 محدد التيار (عند المستهلك)",
       "لحظي (بلا تأخير)"
      ]
     ]
    }
   ]
  },
  "u7-l3": {
   "match": [
    {
     "title": "وصّل كل حالة بالجهاز الذي يحمي منها",
     "pairs": [
      [
       "زيادة الحمل فوق التيار الاسمي",
       "القاطع الحراري (يفصل بعد بعض الوقت)"
      ],
      [
       "دائرة قصر (مع فصل مغناطيسي)",
       "القاطع المغناطيسي السريع"
      ],
      [
       "دائرة قصر (مفتاح بلا فصل مغناطيسي)",
       "مصهرات على التوالي"
      ],
      [
       "تشغيل المحرك وإيقافه",
       "مفتاح وقاية المحرك (مفتاح أجهزة أيضاً)"
      ]
     ]
    }
   ]
  },
  "u7-l4": {
   "match": [
    {
     "title": "وصّل كل وقاية للمحول بمبدئها",
     "pairs": [
      [
       "الوقاية الفرقية",
       "تعمل عندما ΔI = I<sub>1</sub> − I<sub>2</sub> ≠ 0"
      ],
      [
       "الوقاية بالاتزان",
       "حلقة حديدية تمر بها أطراف المحول، تختل عند تأريض وجه"
      ],
      [
       "قصر خارج منطقة الحماية",
       "لا يعمل المرحل الفرقي"
      ],
      [
       "متمم الاتزان عند العطل",
       "يغلق دائرة البطارية على ملف فصل المفتاح"
      ]
     ]
    }
   ]
  },
  "u7-l5": {
   "match": [
    {
     "title": "وصّل كل خطر على المولد بالمتمم الذي يحمي منه",
     "pairs": [
      [
       "الأخطار الداخلية",
       "المتمم الفرقي"
      ],
      [
       "التسرب الأرضي أو القصر",
       "متمم الاتزان الحلقي"
      ],
      [
       "زيادة الحمل",
       "المتمم الحراري"
      ],
      [
       "قصر على الموصلات (مفتاح وقاية الموصلات)",
       "القاطع الكهرومغناطيسي"
      ]
     ]
    }
   ]
  }
 }
});
