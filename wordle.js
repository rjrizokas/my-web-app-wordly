let height = 6; // number of guesses
let width = 5; // length of the word

let row = 0; // current guess (attempt #)
let col = 0; // current letter for that attempt

let gameOver = false;
let word = ''; // The word to guess, initialized as empty
let wordList = ["агава", "аллах", "анфас", "аршин", "азарт", "алыча", "арабы", "атака", "абрис", "акула", "аминь", "арест", "афиша", "автор", "алкаш", "анонс", "архив", "адрес", "алтын", "апчхи", "астра", "абрек", "актив", "амеба", "арена", "афера", "автол", "алиби", "ангел", "архар", "адепт", "алмаз", "апорт", "астма", "аборт", "актер", "амвон", "ареал", "атолл", "аврал", "алеть", "ангар", "армяк", "агнец", "аллюр", "аорта", "аспид", "абзац", "акать", "амбар", "аргон", "атлет", "авось", "акция", "ампир", "армия", "агент", "аллея", "анчар", "аскет", "аббат", "аймак", "альфа", "арбуз", "атлас", "аванс", "акциз", "ампер", "аркан", "ахать", "бабка", "бандо", "басок", "бекон", "биржа", "бляха", "боров", "бровь", "букли", "буфер", "базар", "баржа", "бахча", "белье", "битки", "божий", "бочар", "бубен", "бурав", "былье", "балет", "бармы", "бдеть", "бивак", "блажь", "более", "брань", "будка", "бурки", "банда", "басня", "бекас", "бином", "блюдо", "борец", "брить", "букле", "бутуз", "бадья", "барда", "батут", "белый", "битва", "божба", "ботва", "брюхо", "бульк", "былой", "балда", "барка", "башня", "бетон", "благо", "боком", "брада", "будет", "бурка", "бювар", "банан", "басма", "бейка", "билет", "блуза", "бордо", "брешь", "букет", "бутсы", "багор", "баран", "батон", "белок", "бисер", "богач", "босяк", "брюки", "булка", "быдло", "бакен", "барич", "башка", "берет", "битюг", "бокал", "брага", "бугор", "бурда", "бычок", "балык", "баски", "бедро", "бизон", "блоха", "бонна", "бремя", "буква", "бутон", "багет", "барак", "батог", "белка", "бирюк", "бобик", "босой", "брысь", "булат", "бухта", "байка", "барин", "бачок", "берег", "битый", "бойня", "браво", "бугай", "буран", "бытье", "балок", "барыш", "бегун", "бидон", "блеск", "бомба", "брать", "будто", "бурый", "багаж", "банка", "баста", "белек", "бирка", "бобер", "борть", "броня", "букса", "буфет", "базис", "барий", "бачки", "беляк", "битлы", "божок", "бочка", "бубны", "бурак", "бытие", "балка", "барон", "бегом", "бивни", "бланк", "болид", "брасс", "будни", "бурун", "влево", "вожжи", "ворон", "всего", "въявь", "выпот", "ватин", "вдова", "верша", "вживе", "вирус", "внове", "война", "вояка", "всяко", "выгиб", "вьюга", "вакса", "вбить", "везде", "ветвь", "взлет", "витой", "вклад", "вовне", "волок", "врата", "вуаль", "вызов", "валки", "вволю", "венец", "вечно", "визит", "власы", "вождь", "ворог", "врыть", "въезд", "выпас", "ванна", "вдеть", "верфь", "веять", "вираж", "внизу", "возок", "вотще", "всюду", "вывоз", "вышка", "вазон", "ваять", "вежда", "весть", "вздох", "вития", "вовек", "волна", "враль", "втуне", "выезд", "валка", "ввить", "велюр", "вечер", "визир", "вишня", "влага", "вожак", "вопль", "врозь", "вшить", "выпад", "вальс", "вдвое", "верба", "вещун", "виола", "вмять", "возня", "вотум", "всход", "вывод", "вычет", "вагон", "вахта", "ведро", "вести", "вздор", "висок", "вобла", "волан", "враки", "втрое", "выдра", "валик", "ввиду", "велик", "ветла", "взять", "вихрь", "вкупе", "водка", "вольт", "вроде", "вширь", "вынос", "валун", "вдаль", "вепрь", "вещий", "вилок", "влить", "возле", "ворох", "вслух", "вывих", "выход", "вафля", "вдруг", "весна", "взвод", "виски", "внять", "вокал", "впрок", "втора", "выдох", "вящий", "валет", "вверх", "векша", "ветка", "взрыв", "вихор", "вкруг", "вовсю", "волхв", "время", "вчуже", "выкуп", "валуй", "вдали", "венок", "вешка", "вилла", "влечь", "возка", "ворот", "вслед", "выбор", "вырез", "ватка", "вдоль", "весло", "взвар", "вирши", "вновь", "войти", "впору", "втечь", "выгон", "вялый", "валек", "вброд", "везти", "ветер", "взнос", "виток", "вкось", "вовсе", "волос", "врать", "вчера", "выйти", "валок", "ввысь", "веник", "вечор", "вилка", "гамма", "гирло", "говор", "горец", "грива", "гуляш", "гвалт", "глина", "голод", "гость", "грудь", "гусар", "гайка", "гетры", "гнать", "гольф", "графа", "грязи", "гамак", "гипюр", "гобой", "гопак", "греча", "гудок", "гашиш", "гладь", "голик", "горох", "груда", "гусак", "газон", "герой", "глыба", "голье", "грань", "гряда", "галун", "гиена", "гнуть", "гонор", "греть", "губка", "гарус", "главк", "голец", "город", "гросс", "гурия", "газик", "гений", "глушь", "голыш", "гранд", "грыжа", "гюрза", "галоп", "гидра", "гнить", "гонка", "греко", "гуашь", "гарем", "глава", "годок", "горло", "гроза", "гунны", "гавот", "гелий", "глубь", "голый", "грамм", "груша", "гусли", "галлы", "гжель", "гниль", "гонец", "греки", "гуано", "гараж", "гичка", "гогот", "горка", "грипп", "гумно", "гейша", "глист", "голос", "гофре", "грунт", "гусем", "галка", "гетто", "гнида", "гомон", "греза", "грязь", "дебош", "детка", "догма", "досыл", "дрова", "дутый", "деизм", "дикий", "докер", "драга", "дрофа", "дуэль", "дамка", "демон", "длина", "донец", "драть", "дужка", "дырка", "дебит", "детва", "довод", "досуг", "дробь", "дурно", "девка", "диета", "дойти", "дочка", "дрозд", "душок", "дамба", "делец", "длань", "домра", "драма", "дудка", "дымок", "дебил", "десть", "добро", "доска", "дрема", "дурак", "дятел", "девиз", "диван", "доить", "доход", "дрожь", "душка", "далее", "дележ", "дичок", "домой", "драла", "дубье", "дымка", "дебет", "десна", "добре", "донос", "дрель", "дупло", "дюшес", "дебют", "дзюдо", "дозор", "дотла", "дроги", "духан", "давно", "декан", "динго", "домна", "драка", "дубль", "дылда", "дверь", "дерби", "днище", "донор", "дрейф", "думка", "дюжий", "дебри", "дефис", "дождь", "досье", "дрога", "дутье", "давка", "деист", "динар", "долой", "драже", "дрянь", "дыбом", "даром", "денди", "длить", "донка", "древо", "дукат", "дышло", "есаул", "егерь", "ездка", "ересь", "евреи", "ежиха", "емкий", "евнух", "ежели", "екать", "едкий", "езжай", "ехать", "егоза", "ездок", "жарок", "жизнь", "жучок", "желоб", "жилье", "жерло", "жокей", "жалко", "живот", "жучка", "ждать", "жилой", "жерех", "жница", "жакет", "живой", "жупел", "жвала", "жилка", "жердь", "житье", "жакан", "живец", "жупан", "жатка", "жилец", "жених", "житие", "жажда", "жетон", "жулик", "жатва", "жилет", "желчь", "жираф", "жабры", "жесть", "жрать", "задом", "залог", "заряд", "зверь", "злюка", "забор", "зазор", "занос", "затея", "земля", "зубец", "завуч", "закал", "запев", "зачем", "зипун", "задок", "залив", "зарок", "звено", "злоба", "забой", "зажор", "замша", "затем", "зелье", "зреть", "завоз", "заказ", "запах", "заход", "зимой", "зыбун", "задел", "залеж", "зарез", "звать", "злить", "забег", "зажим", "замор", "засол", "зевок", "зразы", "завод", "зайти", "запас", "заумь", "зефир", "зыбка", "загон", "закут", "зараз", "зачин", "злеть", "заезд", "замок", "засов", "зебра", "знать", "завет", "зайка", "запал", "затор", "зерно", "зурна", "загиб", "закон", "запор", "зачет", "злато", "задор", "залом", "засим", "здесь", "знамя", "завал", "заика", "запад", "затон", "зенит", "зубок", "загар", "закат", "запой", "зачес", "зиять", "кокки", "комок", "корма", "кошма", "кроха", "кулак", "кураж", "казус", "канат", "касса", "кегли", "киста", "кляча", "колея", "конюх", "космы", "краса", "крыса", "кулич", "кусок", "кабак", "какой", "канюк", "катод", "кзади", "клака", "кобза", "колун", "копыл", "котик", "криль", "кубок", "кумыс", "куцый", "кадры", "камея", "карат", "кашне", "киоск", "клещи", "кожух", "койот", "комод", "корка", "кошка", "кросс", "кукла", "купон", "казнь", "канал", "каска", "квота", "киска", "клюка", "колер", "конус", "косец", "краля", "крыло", "кулик", "курсы", "каков", "канун", "катет", "кефир", "кладь", "князь", "колос", "копун", "котел", "крест", "кубик", "кумир", "кухня", "кадка", "калым", "капут", "кашка", "кизяк", "клеть", "кожан", "койка", "комик", "кореш", "кочка", "крона", "кукиш", "купол", "казна", "камыш", "карта", "кварц", "кисея", "клуша", "колба", "конка", "корье", "кража", "круча", "кулеш", "курок", "какао", "каноэ", "катер", "кепка", "кишка", "книзу", "колок", "копна", "косяк", "крепь", "кряду", "кумач", "кутья", "кадет", "калий", "капот", "качка", "кизил", "клест", "когда", "козни", "комар", "корда", "кочик", "кроме", "кузов", "купля", "кювет", "казан", "камса", "карст", "квант", "кисет", "клоун", "кокос", "конец", "корчи", "краги", "крупа", "кулек", "курия", "кайма", "канон", "катар", "кенаф", "кичка", "книга", "колли", "копия", "кость", "креол", "крыша", "культ", "куток", "кагор", "калач", "капор", "катыш", "кивок", "клерк", "ковер", "козлы", "кольт", "коран", "кочан", "кроль", "кузен", "купец", "кушак", "казак", "камка", "карий", "каюта", "кирка", "клише", "кокон", "конек", "короб", "кощей", "круиз", "кулан", "курды", "кайло", "канва", "каста", "келья", "кисть", "кнехт", "колит", "копер", "косой", "кредо", "крыть", "кулон", "кутеж", "кабан", "калан", "капля", "каток", "кивер", "класс", "кобра", "колье", "копье", "кофта", "кровь", "кудри", "кунак", "кучер", "кадык", "камин", "карга", "кашпо", "кирза", "клика", "козел", "лампа", "легат", "летка", "линия", "ложок", "лычко", "ларец", "лейка", "лиана", "лихач", "лохмы", "лютик", "лавра", "лафит", "ленца", "лиман", "лобби", "лузга", "ляпис", "лакей", "левый", "лесть", "линза", "ложка", "лычки", "ларек", "лезть", "леший", "литье", "лотос", "люпин", "лавка", "латук", "лента", "лилия", "лишек", "лужок", "лямка", "лайка", "левша", "леска", "линек", "лодка", "лысый", "лапша", "лежмя", "летун", "литой", "лопух", "люнет", "лаваш", "латка", "лемур", "ликер", "лишай", "лубок", "ляжка", "лазер", "левак", "лепта", "лимфа", "ловля", "лыжня", "лапта", "лежка", "летом", "литер", "ломка", "любой", "лабаз", "лассо", "лемма", "лидер", "лицей", "лошак", "лютый", "ладья", "лгать", "лепка", "лимон", "ловец", "лучок", "лапка", "лежак", "леток", "лирик", "локон", "льяло", "ласка", "лемех", "ливер", "лихой", "лоция", "лютня", "ладан", "лаять", "лепет", "лимит", "лобок", "лунка", "майка", "мания", "мафия", "метан", "мираж", "монах", "мужик", "мысль", "макси", "манто", "медяк", "метод", "млеть", "мосол", "мумие", "мялка", "мадам", "маляр", "маска", "мерка", "мидия", "мойва", "мотор", "мусор", "мазут", "мание", "матка", "месяц", "миома", "молча", "мразь", "мысик", "макет", "манси", "медик", "метла", "мишка", "моряк", "муляж", "мякиш", "магма", "малыш", "марля", "мерин", "мигом", "можно", "моток", "мурло", "мазок", "манер", "масть", "месть", "минус", "молох", "мошна", "мымра", "макар", "манок", "мачта", "метка", "митра", "мороз", "мулла", "мышца", "магия", "малый", "марка", "менее", "мешок", "может", "мотня", "мурка", "мятый", "мазня", "манеж", "масса", "место", "минор", "молот", "мошка", "мчать", "майор", "манна", "махры", "метис", "миска", "морда", "мулат", "мышка", "магий", "малец", "марал", "мелок", "мечта", "много", "мотка", "мураш", "мятеж", "мажор", "манго", "масон", "мести", "минер", "молва", "мочка", "мушка", "майна", "манка", "махра", "метил", "мирра", "мопед", "музей", "мыший", "мавры", "малек", "манту", "мезга", "метро", "мнить", "мотив", "мумия", "мямля", "маета", "мамка", "масло", "месса", "милый", "мойка", "мохер", "муфта", "навык", "накат", "нарыв", "нейти", "низом", "норов", "надел", "намаз", "нахал", "ненцы", "ничей", "нужда", "навар", "нажин", "нанос", "наяда", "нетто", "ножик", "нытик", "навой", "наказ", "нарты", "недуг", "низок", "норма", "нагул", "налог", "наука", "немцы", "нитка", "ночью", "набор", "нажим", "нанка", "наяву", "несун", "новый", "нырок", "навоз", "найти", "народ", "недра", "нигде", "норка", "нагой", "налим", "натек", "немой", "нимфа", "носок", "набок", "нажиг", "намыв", "начет", "несть", "нищий", "нынче", "навет", "назло", "нарез", "негры", "нивхи", "номер", "нагар", "налив", "насос", "некто", "никто", "носка", "набег", "наезд", "намет", "начес", "нести", "ничья", "нутро", "навес", "назем", "напор", "негде", "нечто", "ножны", "наган", "налет", "наряд", "некий", "никак", "носик", "набат", "надой", "намек", "нация", "нерпа", "ничто", "нулик", "навек", "назад", "напев", "невод", "нефть", "ножка", "нюанс", "отара", "откос", "отчет", "обмен", "овощи", "окать", "олифа", "опиум", "ореол", "отвес", "отрез", "офорт", "оазис", "обруб", "огонь", "оковы", "омлет", "опрос", "осетр", "отдел", "отряд", "очерк", "обида", "обуза", "ожечь", "оксид", "опала", "орало", "особь", "отава", "отзыв", "отцов", "обман", "обыск", "озноб", "олимп", "опить", "ордер", "отвар", "отпор", "офеня", "оброк", "овчар", "оклик", "омела", "опора", "осень", "отгул", "отрыв", "очень", "обзор", "обувь", "одурь", "округ", "онуча", "орава", "особа", "осыпь", "отжиг", "отход", "облом", "объем", "озимь", "олива", "опись", "орден", "отвал", "отлив", "отъем", "обрез", "овсюг", "оклад", "омега", "опока", "осада", "отгон", "отруб", "охота", "обгон", "обряд", "одеть", "окрол", "оникс", "опять", "ослик", "остол", "отечь", "отток", "ошуюю", "облик", "общий", "озеро", "олень", "опера", "оргия", "отбор", "отлет", "отчим", "обрат", "овраг", "окись", "ольха", "опоек", "орлец", "отвод", "отрок", "охать", "обвод", "обрыв", "одежа", "окрик", "омыть", "оптом", "оскал", "остов", "отель", "отсек", "очный", "обком", "обход", "оземь", "окунь", "опека", "орган", "отбой", "откуп", "отчий", "образ", "овощь", "океан", "олово", "оплот", "орлан", "ответ", "отрог", "офсет", "обвал", "обруч", "огрех", "около", "омуль", "оптик", "осина", "отдых", "отсев", "очник", "обить", "обуть", "ожить", "октет", "опара", "орать", "осока", "помин", "порты", "почем", "прима", "пугач", "пыжик", "палец", "пасмо", "пемза", "петля", "пинта", "племя", "подол", "покой", "полив", "понос", "после", "почта", "проем", "пупок", "пьянь", "панты", "патер", "пепел", "пешка", "питье", "плита", "позже", "полоз", "порка", "потек", "праща", "прядь", "пучок", "пяток", "пакет", "пария", "пачка", "персы", "пикап", "пласт", "побег", "пойло", "помет", "порою", "почва", "прием", "птица", "пшено", "палех", "парша", "пекло", "петит", "пинок", "плева", "подле", "покои", "помпа", "посев", "почки", "проба", "пульт", "пьеса", "панно", "пасха", "пенни", "пеший", "питон", "плешь", "позер", "полет", "полог", "порей", "посыл", "право", "прыть", "путик", "пятно", "пайка", "парик", "пацан", "перст", "пижон", "пламя", "пнуть", "поить", "полюс", "порох", "поход", "преть", "псина", "пчела", "палаш", "парча", "пегий", "песок", "пилот", "плаха", "повод", "покер", "помор", "посад", "почка", "приют", "пульс", "пышка", "панна", "пасть", "пенка", "печка", "писец", "плечо", "пожня", "полба", "полка", "порез", "посул", "поэма", "прочь", "путем", "пятка", "падуб", "парез", "пахта", "перси", "пиано", "пищик", "плыть", "поиск", "полый", "порок", "потоп", "пресс", "псарь", "пущий", "палач", "парус", "певец", "песня", "пилка", "плаун", "повар", "показ", "помол", "порыв", "почин", "причт", "пузан", "пытка", "панда", "пасти", "пение", "пехом", "пирог", "плеть", "пожар", "покус", "полис", "попка", "посох", "пошиб", "просо", "пусть", "пятак", "падеж", "парад", "пафос", "перец", "пиала", "пицца", "плоть", "позыв", "полон", "порой", "потом", "прель", "пряха", "пушок", "пятью", "палас", "парта", "паять", "песнь", "пикша", "плато", "повал", "пойти", "помои", "порча", "почет", "принц", "пудра", "пырей", "палка", "паста", "пенал", "петух", "пират", "плеск", "поезд", "покос", "полип", "пончо", "посол", "почти", "проза", "пурга", "пясть", "папка", "пауза", "перед", "пешня", "пихта", "плица", "позор", "полок", "порог", "поток", "предо", "пряжа", "пушка", "пятый", "пакля", "паром", "пашня", "песец", "пикет", "плата", "побои", "пойма", "радон", "рафик", "резец", "ритор", "рокот", "ружье", "рыжий", "район", "рвань", "рейка", "рогач", "ропот", "рупия", "рысца", "ранет", "ребус", "ретро", "рожок", "рубеж", "ручей", "рядно", "радио", "раунд", "резак", "рикша", "рознь", "ругня", "рывок", "разум", "рачок", "резус", "ровня", "ропак", "рулон", "рысий", "ранее", "ребро", "репей", "родня", "ртуть", "русый", "рябой", "радий", "ратай", "режим", "ржать", "розно", "рубль", "рыбий", "разор", "рачий", "резон", "ровно", "рондо", "рулет", "рысак", "рампа", "рдеть", "рента", "родич", "рояль", "русло", "рюмка", "раджа", "расти", "редут", "реять", "розга", "рубка", "рыбец", "разом", "рация", "резня", "робот", "роман", "рукав", "рынок", "рамка", "рвота", "ремиз", "родео", "рохля", "русак", "рэкет", "радар", "ранчо", "редис", "решка", "розан", "рубин", "рыбак", "ряска", "разве", "рахит", "резка", "рифма", "ролик", "руина", "рында", "ралли", "рвать", "рельс", "рогоз", "ротор", "рупор", "рычаг", "равно", "ранец", "регби", "речка", "рожон", "рубец", "ручка", "рядом", "салат", "сатин", "свита", "седок", "сетка", "синий", "скирд", "слеза", "сметь", "совет", "сорок", "спеть", "сряду", "стиль", "ступа", "сутки", "сырой", "саман", "сбить", "связь", "семью", "сжить", "сироп", "скоба", "слуга", "смута", "сойти", "сосуд", "спора", "сталь", "стопа", "судок", "сушка", "сыщик", "садок", "самый", "свара", "сдуру", "сербы", "сидор", "сиять", "скунс", "слюни", "снизу", "сонет", "сотый", "сразу", "стезя", "строй", "сумма", "сцена", "сакля", "сарыч", "свист", "седой", "сесть", "силос", "скетч", "слега", "смета", "собор", "сорго", "спесь", "срыть", "стечь", "стужа", "сутаж", "сырец", "салют", "сачок", "свыше", "семга", "сжечь", "сирин", "склон", "слово", "смрад", "сойка", "сосок", "сплин", "стадо", "столь", "судно", "сучок", "сычуг", "садик", "самум", "сбыть", "сдоба", "сепия", "сивый", "сифон", "скула", "слюна", "снедь", "соляр", "сотня", "спуск", "створ", "стриж", "сумка", "схима", "сайра", "саржа", "свиль", "седло", "серый", "силок", "сквер", "слева", "смесь", "собес", "сопля", "спать", "сроду", "степь", "струя", "сусло", "сынок", "салоп", "сахар", "свояк", "секта", "сжать", "синяк", "склеп", "слить", "смочь", "содом", "сосна", "спирт", "ссуда", "столп", "судия", "сучка", "сытый", "саван", "самка", "сбруя", "сдвиг", "сенат", "сивуч", "ситро", "скука", "слюда", "смять", "солон", "сотка", "спрут", "ствол", "страх", "сукно", "схема", "сайка", "сарай", "свеча", "север", "серсо", "силой", "скарб", "слать", "смерч", "снять", "сопло", "спазм", "средь", "стенд", "струп", "сусек", "съезд", "салон", "сауна", "свора", "секач", "сеять", "синус", "склад", "слизь", "смотр", "совок", "соска", "спина", "ссора", "столб", "судак", "сухой", "сырье", "сабля", "самец", "сброд", "сдача", "сенаж", "сивка", "ситец", "скрип", "слышь", "смыть", "солод", "сосцы", "спрос", "стать", "страж", "суета", "сфера", "сюита", "сайда", "сапер", "сверх", "сеанс", "серна", "силач", "скань", "слайд", "смерд", "сноха", "сопли", "сошка", "среди", "стена", "струг", "сурок", "сшить", "салки", "сатир", "свить", "сезон", "сечка", "синод", "скифы", "слива", "смола", "совка", "сосед", "спечь", "ссечь", "стоик", "стыть", "суфле", "сырок", "саами", "самбо", "сбоку", "сдать", "семья", "сзади", "сирый", "сколь", "слыть", "смысл", "сокол", "сосун", "спорт", "старт", "стояк", "судья", "сущий", "сюжет", "сазан", "санки", "сваха", "сдуть", "серия", "сизый", "скала", "слава", "смена", "снова", "сопка", "софит", "среда", "стела", "строп", "сурик", "счеты", "тулуп", "тычок", "такса", "тахта", "тенор", "титло", "топот", "треск", "тунец", "тягач", "табак", "талый", "театр", "тесто", "тлеть", "тоска", "триер", "турне", "таган", "тапер", "телец", "типаж", "толща", "тракт", "труба", "тузик", "тыква", "такой", "тафта", "тенек", "титан", "топор", "трель", "тумба", "тюфяк", "талон", "твист", "тесак", "ткать", "торос", "трефы", "турки", "тавро", "танин", "текст", "тиара", "толпа", "трава", "трояк", "тугой", "тщета", "таков", "таска", "тембр", "тиски", "топка", "треба", "туман", "тютюн", "талия", "тварь", "терка", "ткань", "торец", "треух", "турка", "тяпка", "табун", "танец", "теизм", "течка", "толки", "тощий", "тропа", "трюмо", "тушка", "тайна", "тариф", "телок", "тиран", "топаз", "траур", "тумак", "тюрки", "талер", "таять", "терем", "тихий", "торги", "треть", "тупой", "тяжба", "табор", "танго", "тезка", "тетка", "тогда", "точка", "тромб", "труха", "туфта", "тайга", "таран", "телка", "тираж", "тонус", "трата", "тулья", "тюбик", "такси", "тачка", "тепло", "титул", "торба", "трест", "тупик", "тягло", "табло", "тальк", "тезис", "тесть", "товар", "тотем", "трико", "туфли", "таить", "тапир", "телик", "типун", "томат", "транс", "трусы", "фавор", "ферзь", "финиш", "форум", "фьють", "факир", "фибра", "фишка", "фреза", "фаска", "филер", "флора", "фужер", "фенол", "финик", "форте", "фьорд", "факел", "фиакр", "фирма", "фрахт", "фасад", "филей", "флокс", "фугас", "фенил", "финал", "форма", "фурор", "фазис", "фетиш", "фиорд", "франт", "фанза", "фикус", "флирт", "фрукт", "фаянс", "фильм", "фомка", "фурия", "фазан", "феска", "финны", "франк", "фальц", "физик", "флешь", "фронт", "фауна", "филон", "фокус", "фураж", "фагот", "ферма", "финка", "фраза", "фюрер", "фалда", "фижмы", "фланг", "френч", "фасон", "филин", "фляга", "фуляр", "хвост", "ходка", "хохол", "хайло", "химия", "холоп", "хурал", "хамса", "хлыст", "хорал", "хворь", "хобот", "хохма", "химик", "холод", "хунта", "халиф", "хитон", "хомяк", "хвать", "хобби", "хором", "хиляк", "холка", "худой", "халда", "хиппи", "хомут", "ханты", "хмель", "хорек", "хилый", "ходом", "хруст", "халва", "хинин", "холуй", "хутор", "ханжа", "хлябь", "хорей", "херес", "ходок", "хохот", "халат", "хинди", "холст", "хурма", "хамье", "хлюст", "хорда", "цибик", "цифра", "цевка", "цыпки", "цепка", "цитра", "цвето", "цыпка", "центр", "циник", "цапля", "цуцик", "целый", "цинга", "цапка", "цукат", "цедра", "цикля", "цокот", "цевье", "чепец", "чирей", "чужой", "чайка", "череп", "чрево", "чумак", "часом", "чехол", "чубук", "чушка", "челка", "чижик", "чужак", "чадра", "через", "чохом", "чулок", "чарка", "четки", "чтить", "чутье", "чекан", "чибис", "чудом", "чабан", "черед", "читка", "чулан", "чалый", "честь", "чтиво", "чуток", "чаять", "чешуя", "чудик", "червь", "число", "чукчи", "чалма", "черта", "чрезо", "чурка", "чашка", "чешки", "чудак", "черви", "чирок", "чуйка", "чалка", "чернь", "чреда", "чурек", "часть", "чечет", "чугун", "чуять", "шабаш", "шасть", "шепот", "шквал", "шпана", "штрих", "шакал", "шафер", "шинок", "шлейф", "шприц", "шумок", "шамот", "шведы", "шифер", "шорох", "штиль", "шхеры", "шасси", "шемая", "шкала", "шпала", "штрек", "шайка", "шатун", "шизик", "шланг", "шпора", "шулер", "шаман", "шваль", "шитье", "шорня", "штаны", "шушун", "шарик", "шельф", "шишка", "шпага", "штраф", "шайба", "шатия", "шесть", "шкура", "шпион", "штырь", "шалый", "шашни", "шитый", "шмель", "штамп", "шутка", "шарах", "шелом", "шишак", "шофер", "шторм", "шагом", "шатер", "шерпы", "школа", "шпиль", "штурм", "шалун", "шашка", "ширма", "шляпа", "шрифт", "шуруп", "шапка", "шейка", "шихта", "шоссе", "штора", "шавка", "шатен", "шериф", "шкода", "шпаты", "штука", "шалаш", "шахта", "шипун", "шлюха", "шпунт", "шурин", "шанец", "шевро", "шифон", "шорты", "штифт", "шхуна", "щипцы", "щелок", "щипок", "щелка", "щечка", "щекот", "щетка", "щучий", "щегол", "щепка", "щиток", "щенок", "эвены", "энный", "эстет", "эмаль", "эскиз", "элита", "эркер", "экран", "эрзац", "этнос", "эклер", "эпоха", "этика", "иваси", "ивняк", "игрец", "игрок", "игрун", "идеал", "идиот", "иерей", "ижица", "избач", "извив", "извне", "извод", "извоз", "изгиб", "изгой", "излет", "излом", "изъян", "изыск", "изюбр", "икать", "икона", "икота", "иметь", "индус", "индюк", "инжир", "интер", "инъяз", "иприт", "ирбис", "искра", "искус", "ислам", "испуг", "истец", "исток", "истый", "исход", "итого", "иудеи", "ихний", "ишиас", "уазик", "убить", "убыль", "убыть", "увить", "уголь", "угорь", "удаль", "удача", "удила", "удить", "уесть", "ужели", "узина", "узить", "узкий", "узник", "уклад", "уклон", "укора", "укроп", "уксус", "улика", "улита", "улица", "уметь", "умник", "умный", "умора", "умыть", "умять", "унция", "унять", "упечь", "упрек", "упырь", "усечь", "усики", "успех", "устав", "устой", "уступ", "устье", "утеря", "утеха", "утечь", "утиль", "утица", "утлый", "утром", "ухарь", "ухват", "учеба", "учить", "учхоз", "ушить", "ушкуй", "ушлый", "ушник", "ушной", "ущерб", "ябеда", "явить", "явный", "ягель", "ягода", "ягуар", "яичко", "якобы", "якорь", "якуты", "ямина", "ямщик", "яркий", "ярлык", "ярыга", "ясень", "ясный", "яство", "ястык", "яхонт", "юннат", "юнкер", "юниор", "юркий", "юлить", "юрист", "юкола", "юноша", "юдоль"]

let guessList = ["ааааа"]

guessList = guessList.concat(wordList);

window.onload = function() {
    initialize();
    fetchWord(); // Fetch the word from the server on page load
}

async function fetchWord() {
    try {
        const response = await fetch('https://my-web-app-wordly.onrender.com/get_word');
        const data = await response.json();
        word = data.word.toUpperCase();
        console.log("Current word: ", word);
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

function initialize() {
    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create the keyboard
    let keyboard = [
        ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"],
        ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", " "],
        ["Enter", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");
            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            } else if (key == "⌫") {
                keyTile.id = "Backspace";
            } else if (key !== " ") {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            keyTile.classList.add(key == "Enter" ? "enter-key-tile" : key == "⌫" ? "backspace-key-tile" : "key-tile");
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    });
}

const keyMapping = {
    'KeyQ': 'Й', 'KeyW': 'Ц', 'KeyE': 'У', 'KeyR': 'К', 'KeyT': 'Е', 'KeyY': 'Н', 'KeyU': 'Г', 'KeyI': 'Ш', 'KeyO': 'Щ', 'KeyP': 'З',
    'KeyA': 'Ф', 'KeyS': 'Ы', 'KeyD': 'В', 'KeyF': 'А', 'KeyG': 'П', 'KeyH': 'Р', 'KeyJ': 'О', 'KeyK': 'Л', 'KeyL': 'Д',
    'KeyZ': 'Я', 'KeyX': 'Ч', 'KeyC': 'С', 'KeyV': 'М', 'KeyB': 'И', 'KeyN': 'Т', 'KeyM': 'Ь', 'KeyЮ': 'Ю', 'KeyП': 'П'
};

function processKey() {
    let key = this.id;
    let letter = this.innerText;

    let event = { "code": key === "Enter" ? "Enter" : key === "Backspace" ? "Backspace" : "Key" + letter };

    processInput(event);
}

function processInput(e) {
    if (gameOver) return;

    let keyCode = e.code;
    let letter = "";

    if (keyMapping[keyCode]) {
        letter = keyMapping[keyCode];
    } else if (keyCode === "Backspace") {
        if (col > 0) {
            col -= 1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    } else if (keyCode === "Enter") {
        update();
        return; // Skip further processing if Enter is pressed
    }

    if (letter && col < width) {
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        if (currTile.innerText === "") {
            currTile.innerText = letter;
            col += 1;
        }
    }

    if (!gameOver && row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    // Collect the guess from the board
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();
    console.log(guess);

    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in word list";
        return;
    }

    let correct = 0;

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }

    console.log(letterCount);

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add("correct");
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            gameOver = true;
        }
    }

    console.log(letterCount);
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent");
            }
        }
    }

    row += 1;
    col = 0;
}


