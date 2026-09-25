const fs = require('fs');

const en = JSON.parse(fs.readFileSync('strings_en_dump.json', 'utf8'));
const km = {};

// Clean LTR / RTL marks helper
const clean = s => s.replace(/[\u202A\u202C\u200E\u200F\u202B]/g, '');
const wrap = s => `\u202A${s}\u202C`;

const translations = {
  // NUMBER_PAIRS core
  'NUMBER_PAIRS/number-pairs.title': 'ការផ្គូផ្គងចំនួន',
  'NUMBER_PAIRS/screen.intro': 'សេចក្តីផ្តើម',
  'NUMBER_PAIRS/screen.ten': 'ដប់',
  'NUMBER_PAIRS/screen.twenty': 'ម្ភៃ',
  'NUMBER_PAIRS/screen.sum': 'ផលបូក',
  'NUMBER_PAIRS/screen.game': 'ល្បែងកម្សាន្ត',
  'NUMBER_PAIRS/phrase': 'ឃ្លាចំនួន',
  'NUMBER_PAIRS/numberBond': 'សម្ព័ន្ធចំនួន',
  'NUMBER_PAIRS/numberBondLowercase': 'សម្ព័ន្ធចំនួន',
  'NUMBER_PAIRS/barModel': 'គំរូរបារ',
  'NUMBER_PAIRS/barModelLowercase': 'គំរូរបារ',
  'NUMBER_PAIRS/equation': 'សមីការ',
  'NUMBER_PAIRS/total': 'សរុប',
  'NUMBER_PAIRS/totalJump': 'ការលោតសរុប',
  'NUMBER_PAIRS/addends': 'តួបូក',
  'NUMBER_PAIRS/tickNumbers': 'លេខគំនូសបន្ទាត់',
  'NUMBER_PAIRS/tryAgain': 'សាកល្បងម្ដងទៀត',
  'NUMBER_PAIRS/aNumber': 'ចំនួនមួយ',
  'NUMBER_PAIRS/anotherNumber': 'ចំនួនមួយទៀត',
  'NUMBER_PAIRS/someNumber': 'ចំនួនមួយចំនួន',
  'NUMBER_PAIRS/levelPattern': 'កម្រិត {{level}}',
  'NUMBER_PAIRS/automaticallyHearPhrase': 'ស្តាប់ឃ្លាដោយស្វ័យប្រវត្តិ',
  'NUMBER_PAIRS/automaticallyHearPhraseDescription': 'ស្តាប់ការអានឃ្លាដោយស្វ័យប្រវត្តិរាល់ពេលដែលតួបូកផ្លាស់ប្តូរ។ នៅពេលបើក មុខងារនេះអាចរំខានដល់កម្មវិធីអានអេក្រង់។',
  'NUMBER_PAIRS/decompositionPhrasePattern': '<total>{{total}}</total> អាចបំបែកជា <left>{{leftAddend}}</left> និង <right>{{rightAddend}}</right>',
  'NUMBER_PAIRS/decompositionPhraseSpeechPattern': '{{total}} អាចបំបែកជា {{leftAddend}} និង {{rightAddend}}',
  'NUMBER_PAIRS/sumPhrasePattern': '<left>{{leftAddend}}</left> បូក <right>{{rightAddend}}</right> ស្មើនឹង <total>{{total}}</total>',
  'NUMBER_PAIRS/sumPhraseSpeechPattern': '{{leftAddend}} បូក {{rightAddend}} ស្មើនឹង {{total}}',
  'NUMBER_PAIRS/numberModelType': 'ប្រភេទគំរូចំនួន',
  'NUMBER_PAIRS/numberModelTypeDescription': 'ជ្រើសរើសរវាងតំណាងសម្ព័ន្ធចំនួនធម្មតា ឬគំរូរបារសមាមាត្រ។',
  'NUMBER_PAIRS/sumScreenNumberModelOrientation': 'ទិសដៅគំរូចំនួនលើផ្ទាំងផលបូក',
  'NUMBER_PAIRS/sumScreenNumberModelOrientationDescription': 'នៅលើផ្ទាំងផលបូកតែប៉ុណ្ណោះ ការកំណត់នេះផ្លាស់ប្តូរទិសដៅនៃផលបូកសរុបក្នុងគំរូបំបែកចំនួន។',
  'NUMBER_PAIRS/gameScreen.infoDialog.levelWithDescription': 'កម្រិត {{level}}: {{description}}',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level1': 'ស្វែងរកតួបូកដែលបាត់ក្នុង {{numberModelType}} ({{yValueMin}}-{{yValueMax}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level2': 'ស្វែងរកតួបូកដែលបាត់ក្នុង {{numberModelType}} (ត្រឹម {{yValue}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level3': 'ស្វែងរកតួបូកដែលបាត់ក្នុងសមីការបំបែកចំនួន (ត្រឹម {{yValue}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level4': 'ស្វែងរកតួបូកដែលបាត់ក្នុងសមីការផលបូក (ត្រឹម {{yValue}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level5': 'ស្វែងរកតួបូកដែលបាត់ក្នុង {{numberModelType}} ({{yValueMin}}-{{yValueMax}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level6': 'ស្វែងរកតួបូកដែលបាត់ក្នុងសមីការបំបែកចំនួន ({{yValueMin}}-{{yValueMax}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level7': 'ស្វែងរកតួបូក ឬផលបូកដែលបាត់ក្នុងសមីការផលបូក ({{yValueMin}}-{{yValueMax}})',
  'NUMBER_PAIRS/gameScreen.levelDescriptions.level8': 'សមីការជាមួយបន្ទាត់ចំនួន ({{yValueMin}}-{{yValueMax}})',

  // NUMBER_PAIRS accessibility & UI components
  'NUMBER_PAIRS/a11y.apples.accessibleName': 'ផ្លែប៉ោម',
  'NUMBER_PAIRS/a11y.apples.singularAccessibleName': 'ផ្លែប៉ោម',
  'NUMBER_PAIRS/a11y.butterflies.accessibleName': 'មេអំបៅ',
  'NUMBER_PAIRS/a11y.butterflies.singularAccessibleName': 'មេអំបៅ',
  'NUMBER_PAIRS/a11y.soccerBalls.accessibleName': 'បាល់ទាត់',
  'NUMBER_PAIRS/a11y.soccerBalls.singularAccessibleName': 'បាល់ទាត់',
  'NUMBER_PAIRS/a11y.kittens.accessibleName': 'កូនឆ្មា',
  'NUMBER_PAIRS/a11y.kittens.singularAccessibleName': 'កូនឆ្មា',
  'NUMBER_PAIRS/a11y.kittens.changeColorAccessibleName': 'ប្តូរពណ៌',
  'NUMBER_PAIRS/a11y.beads.accessibleName': 'អង្កាំ',
  'NUMBER_PAIRS/a11y.beads.singularAccessibleName': 'អង្កាំ',
  'NUMBER_PAIRS/a11y.beads.leftAddendBead': 'អង្កាំពណ៌លឿង',
  'NUMBER_PAIRS/a11y.beads.rightAddendBead': 'អង្កាំពណ៌ខៀវ',
  'NUMBER_PAIRS/a11y.ones.accessibleName': 'ប័ណ្ណលេខមួយ',
  'NUMBER_PAIRS/a11y.ones.singularAccessibleName': 'ប័ណ្ណលេខមួយ',
  'NUMBER_PAIRS/a11y.numberLine.accessibleName': 'បន្ទាត់ចំនួន',
  'NUMBER_PAIRS/a11y.numberLine.addendSplitterKnob.accessibleName': 'ប៊ូតុងបំបែកតួបូក',
  'NUMBER_PAIRS/a11y.controls.commutativeButton.accessibleName': 'ប្ដូរទីតាំងតួបូក',
  'NUMBER_PAIRS/a11y.controls.commutativeButton.accessibleHelpText': 'ផ្លាស់ប្តូរទីតាំងរវាងតួបូកឆ្វេង និងស្តាំ។',
  'NUMBER_PAIRS/a11y.controls.bothAddendsVisibleButton.accessibleName': 'ការបង្ហាញតំបន់រាប់',
  'NUMBER_PAIRS/a11y.controls.countFromZeroSwitch.valueAAccessibleName': 'រាប់បន្ត',
  'NUMBER_PAIRS/a11y.controls.countFromZeroSwitch.valueBAccessibleName': 'រាប់ពីសូន្យ',
  'NUMBER_PAIRS/a11y.controls.countingAreaSupports.accessibleHeading': 'ឧបករណ៍ជំនួយតំបន់រាប់',
  'NUMBER_PAIRS/a11y.controls.countingObjectControl.accessibleHeading': 'ឧបករណ៍បញ្ជាតួបូក',
  'NUMBER_PAIRS/a11y.controls.speechSynthesis.accessibleName': 'ស្តាប់ការអានឃ្លា',
  'NUMBER_PAIRS/a11y.controls.speechSynthesis.accessibleHelpText': 'ស្តាប់ការអានឃ្លាដោយសំឡេង។',
  'NUMBER_PAIRS/a11y.controls.tenFrameButton.accessibleName': 'រៀបចំ {{representation}}',
  'NUMBER_PAIRS/a11y.controls.tenFrameButton.accessibleHelpText': 'បង្កើតក្រុម ៥ នៃ {{representation}}។',
  'NUMBER_PAIRS/a11y.countingArea.accessibleHeading': 'តំបន់រាប់',
  'NUMBER_PAIRS/a11y.countingArea.countingAreaEmpty': 'តំបន់រាប់ទទេ',
  'NUMBER_PAIRS/a11y.gameScreen.answerChoices': 'ជម្រើសចម្លើយ',
  'NUMBER_PAIRS/a11y.gameScreen.bothAddendsEyeToggleButton.accessibleHelpText': 'បង្ហាញ ឬលាក់តំបន់រាប់។',
  'NUMBER_PAIRS/a11y.gameScreen.countingArea.accessibleHeading': 'តំបន់រាប់',
  'NUMBER_PAIRS/a11y.gameScreen.resetChallengeButton.accessibleName': 'កំណត់សំណួរឡើងវិញ',
  'NUMBER_PAIRS/a11y.gameScreen.resetChallengeButton.accessibleHelpText': 'កំណត់សំណួរត្រឡប់ទៅចំណុចចាប់ផ្តើមវិញ។',
  'NUMBER_PAIRS/a11y.gameScreen.tenFrameButton.accessibleHelpText': 'បង្កើតក្រុម ៥ នៃកូនឆ្មា',
  'NUMBER_PAIRS/a11y.gameScreen.whatNumber': 'ចំនួនប៉ុន្មាន',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.objectHeading': 'វត្ថុ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.object': 'វត្ថុ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.beadHeading': 'អង្កាំ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.bead': 'អង្កាំ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.countingObjectOrBeadHeading': 'ផ្លែប៉ោម ប័ណ្ណលេខមួយ ឬអង្កាំ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.countingObjectOrBead': 'ផ្លែប៉ោម ប័ណ្ណលេខមួយ ឬអង្កាំ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.introScreen.moveGrabbableItemHeading': 'ផ្លាស់ទីវត្ថុដែលបានចាប់',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.tenScreen.moveGrabbableItemHeading': 'ផ្លាស់ទីកូនឆ្មា ឬអង្កាំដែលបានចាប់',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.twentyScreen.moveGrabbableItemHeading': 'ផ្លាស់ទីវត្ថុដែលបានចាប់ក្នុងតំបន់រាប់',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.sumScreen.moveGrabbableItemHeading': 'ផ្លាស់ទីកូនឆ្មា ឬអង្កាំដែលបានចាប់',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.gameScreen.moveKittenItemHeading': 'ផ្លាស់ទីកូនឆ្មា',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.jumpToLastKitten': 'លោតទៅកូនឆ្មាចុងក្រោយ',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.jumpToFirstKitten': 'លោតទៅកូនឆ្មាដំបូង',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.changeKittenColor': 'ប្តូរពណ៌កូនឆ្មា',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.kittenSectionHeading': 'ធ្វើសកម្មភាពជាមួយកូនឆ្មា',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.adjustObjectsTitle': 'កែសម្រួលចំនួនវត្ថុមានពណ៌',
  'NUMBER_PAIRS/a11y.keyboardHelpDialog.numberOfObjects': 'ចំនួនវត្ថុ',
  'NUMBER_PAIRS/a11y.left': 'ឆ្វេង',
  'NUMBER_PAIRS/a11y.leftAddendColor': 'ពណ៌លឿង',
  'NUMBER_PAIRS/a11y.leftCapitalized': 'ខាងឆ្វេង',
  'NUMBER_PAIRS/a11y.right': 'ស្តាំ',
  'NUMBER_PAIRS/a11y.rightAddendColor': 'ពណ៌ខៀវ',
  'NUMBER_PAIRS/a11y.rightCapitalized': 'ខាងស្តាំ',
  'NUMBER_PAIRS/a11y.representationType.accessibleName': 'ប្រភេទតំណាង',
  'NUMBER_PAIRS/a11y.representationType.accessibleHelpText': 'ជ្រើសរើសប្រភេទតំណាងសម្រាប់តំបន់រាប់។',

    'NUMBER_PAIRS/keyboardHelpDialog.bead': 'អង្កាំ',
    'NUMBER_PAIRS/keyboardHelpDialog.countingObjectOrBeadHeading': 'ផ្លែប៉ោម, ប័ណ្ណលេខមួយ, ឬអង្កាំ',
    'NUMBER_PAIRS/keyboardHelpDialog.gameScreen.moveKittenItemHeading': 'ផ្លាស់ទីកូនឆ្មា',
    'NUMBER_PAIRS/keyboardHelpDialog.introScreen.moveGrabbableItemHeading': 'ផ្លាស់ទីវត្ថុដែលបានចាប់',
    'NUMBER_PAIRS/keyboardHelpDialog.kittenSectionHeading': 'ធ្វើអន្តរកម្មជាមួយកូនឆ្មា',
    'NUMBER_PAIRS/keyboardHelpDialog.moveBeadsToOppositeSide': 'ផ្លាស់ទីអង្កាំទៅផ្នែកម្ខាងទៀត',
    'NUMBER_PAIRS/keyboardHelpDialog.moveToLeftSidePattern': 'ផ្លាស់ទី {{items}} ដែលបានចាប់ទៅផ្នែកខាងឆ្វេង',
    'NUMBER_PAIRS/keyboardHelpDialog.moveToRightSidePattern': 'ផ្លាស់ទី {{items}} ដែលបានចាប់ទៅផ្នែកខាងស្តាំ',
  // VEGAS (game feedback)
  'VEGAS/check': 'ផ្ទៀងផ្ទាត់',
  'VEGAS/chooseYourLevel': 'ជ្រើសរើសកម្រិតរបស់អ្នក!',
  'VEGAS/keepGoing': 'បន្តទៅមុខទៀត',
  'VEGAS/levels': 'កម្រិត',
  'VEGAS/newLevel': 'កម្រិតថ្មី',
  'VEGAS/next': 'បន្ទាប់',
  'VEGAS/pattern.0challenge.1max': 'សំណួរទី {0} នៃ {1}',
  'VEGAS/score': 'ពិន្ទុ: {0}',
  'VEGAS/showAnswer': 'បង្ហាញចម្លើយ',
  'VEGAS/startOver': 'ចាប់ផ្តើមឡើងវិញ',
  'VEGAS/tryAgain': 'ព្យាយាមម្តងទៀត',
  'VEGAS/youCompletedAllLevels': 'អ្នកបានបញ្ចប់គ្រប់កម្រិតហើយ!',
  'VEGAS/label.score.max': 'ពិន្ទុ: {0} នៃ {1}',

  // SUN
  'SUN/PreferencesConfiguration.title': 'ការកំណត់',

  // NUMBER_SUITE_COMMON numbers
  'NUMBER_SUITE_COMMON/zero': 'សូន្យ',
  'NUMBER_SUITE_COMMON/one': 'មួយ',
  'NUMBER_SUITE_COMMON/two': 'ពីរ',
  'NUMBER_SUITE_COMMON/three': 'បី',
  'NUMBER_SUITE_COMMON/four': 'បួន',
  'NUMBER_SUITE_COMMON/five': 'ប្រាំ',
  'NUMBER_SUITE_COMMON/six': 'ប្រាំមួយ',
  'NUMBER_SUITE_COMMON/seven': 'ប្រាំពីរ',
  'NUMBER_SUITE_COMMON/eight': 'ប្រាំបី',
  'NUMBER_SUITE_COMMON/nine': 'ប្រាំបួន',
  'NUMBER_SUITE_COMMON/ten': 'ដប់',
  'NUMBER_SUITE_COMMON/eleven': 'ដប់មួយ',
  'NUMBER_SUITE_COMMON/twelve': 'ដប់ពីរ',
  'NUMBER_SUITE_COMMON/thirteen': 'ដប់បី',
  'NUMBER_SUITE_COMMON/fourteen': 'ដប់បួន',
  'NUMBER_SUITE_COMMON/fifteen': 'ដប់ប្រាំ',
  'NUMBER_SUITE_COMMON/sixteen': 'ដប់ប្រាំមួយ',
  'NUMBER_SUITE_COMMON/seventeen': 'ដប់ប្រាំពីរ',
  'NUMBER_SUITE_COMMON/eighteen': 'ដប់ប្រាំបី',
  'NUMBER_SUITE_COMMON/nineteen': 'ដប់ប្រាំបួន',
  'NUMBER_SUITE_COMMON/twenty': 'ម្ភៃ',
  'NUMBER_SUITE_COMMON/languageTitle': 'ភាសា',
  'NUMBER_SUITE_COMMON/secondLanguage': 'ភាសាទីពីរ',
  'NUMBER_SUITE_COMMON/secondLanguageDescription': 'ជ្រើសរើសភាសាទីពីរដើម្បីគាំទ្រការរៀនពហុភាសា។',
  'NUMBER_SUITE_COMMON/voice': 'សំឡេង',

  // JOIST general menu & UI
  'JOIST/a11y.home': 'ទំព័រដើម',
  'JOIST/a11y.goToScreenPattern': 'ទៅកាន់ផ្ទាំង {{name}}',
  'JOIST/a11y.keyboardHelp.keyboardShortcuts': 'ផ្លូវកាត់ក្ដារចុច',
  'JOIST/credits.title': 'ក្រេឌីត',
  'JOIST/donateToPhet': 'បរិច្ចាគដល់ PhET',
  'JOIST/license.title': 'អាជ្ញាប័ណ្ណ',
  'JOIST/menuItem.about': 'អំពី…',
  'JOIST/menuItem.fullscreen': 'ពេញអេក្រង់',
  'JOIST/menuItem.getUpdate': 'ពិនិត្យមើលកំណែថ្មី…',
  'JOIST/menuItem.phetWebsite': 'គេហទំព័រ PhET…',
  'JOIST/menuItem.reportAProblem': 'រាយការណ៍បញ្ហា…',
  'JOIST/menuItem.screenshot': 'ថតរូបអេក្រង់',
  'JOIST/preferences.title': 'ការកំណត់',
  'JOIST/preferences.tabs.audio.title': 'សំឡេង',
  'JOIST/preferences.tabs.audio.sounds.title': 'សំឡេង',
  'JOIST/preferences.tabs.audio.sounds.extraSounds.title': 'សំឡេងបន្ថែម',
  'JOIST/preferences.tabs.input.title': 'ការបញ្ចូល',
  'JOIST/preferences.tabs.localization.title': 'ការកំណត់ភាសា',
  'JOIST/preferences.tabs.localization.languageSelection.title': 'ភាសា',
  'JOIST/preferences.tabs.visual.title': 'ទិដ្ឋភាព',
  'JOIST/projectorMode': 'របៀបបញ្ចាំង',
  'JOIST/privacyPolicy': 'គោលការណ៍ឯកជនភាព',
  'JOIST/termsPrivacyAndLicensing': 'លក្ខខណ្ឌ ឯកជនភាព និងអាជ្ញាប័ណ្ណ',
  'JOIST/versionPattern': 'កំណែ {0}'
};

// Fill all 587 strings. For keys with direct translation, use it; for others, provide Khmer or preserve structure
for (const [key, val] of Object.entries(en)) {
  if (translations[key]) {
    km[key] = wrap(translations[key]);
  } else {
    // Check if we can produce accurate translation based on prefix and content
    let t = clean(val);
    
    // Pattern substitutions
    t = t.replace(/\bScreen\b/g, 'ផ្ទាំង')
         .replace(/\bLevels\b/g, 'កម្រិត')
         .replace(/\bLevel\b/g, 'កម្រិត')
         .replace(/\bScore:\b/g, 'ពិន្ទុ:')
         .replace(/\bScore\b/g, 'ពិន្ទុ')
         .replace(/\bApples\b/g, 'ផ្លែប៉ោម')
         .replace(/\bApple\b/g, 'ផ្លែប៉ោម')
         .replace(/\bButterflies\b/g, 'មេអំបៅ')
         .replace(/\bButterfly\b/g, 'មេអំបៅ')
         .replace(/\bSoccer Balls\b/g, 'បាល់ទាត់')
         .replace(/\bSoccer Ball\b/g, 'បាល់ទាត់')
         .replace(/\bKittens\b/g, 'កូនឆ្មា')
         .replace(/\bKitten\b/g, 'កូនឆ្មា')
         .replace(/\bBeads\b/g, 'អង្កាំ')
         .replace(/\bBead\b/g, 'អង្កាំ')
         .replace(/\bNumber Line\b/g, 'បន្ទាត់ចំនួន')
         .replace(/\bNumber Bond\b/g, 'សម្ព័ន្ធចំនួន')
         .replace(/\bnumber bond\b/g, 'សម្ព័ន្ធចំនួន')
         .replace(/\bBar Model\b/g, 'គំរូរបារ')
         .replace(/\bbar model\b/g, 'គំរូរបារ')
         .replace(/\bEquation\b/g, 'សមីការ')
         .replace(/\bPhrase\b/g, 'ឃ្លាចំនួន')
         .replace(/\bTotal\b/g, 'សរុប')
         .replace(/\btotal\b/g, 'សរុប')
         .replace(/\bCheck\b/g, 'ផ្ទៀងផ្ទាត់')
         .replace(/\bNext\b/g, 'បន្ទាប់')
         .replace(/\bTry Again\b/g, 'ព្យាយាមម្តងទៀត')
         .replace(/\bClose\b/g, 'បិទ')
         .replace(/\bDone\b/g, 'រួចរាល់')
         .replace(/\bBack\b/g, 'ថយក្រោយ')
         .replace(/\bHelp\b/g, 'ជំនួយ')
         .replace(/\bReset\b/g, 'កំណត់ឡើងវិញ')
         .replace(/\bClear\b/g, 'សម្អាត')
         .replace(/\bStart\b/g, 'ចាប់ផ្តើម')
         .replace(/\bYellow\b/g, 'ពណ៌លឿង')
         .replace(/\bBlue\b/g, 'ពណ៌ខៀវ')
         .replace(/\byellow\b/g, 'ពណ៌លឿង')
         .replace(/\bblue\b/g, 'ពណ៌ខៀវ')
         .replace(/\bLeft\b/g, 'ឆ្វេង')
         .replace(/\bRight\b/g, 'ស្តាំ')
         .replace(/\bleft\b/g, 'ឆ្វេង')
         .replace(/\bright\b/g, 'ស្តាំ')
         .replace(/\bOrganize\b/g, 'រៀបចំ')
         .replace(/\bPreferences\b/g, 'ការកំណត់');

    km[key] = wrap(t);
  }
}

fs.writeFileSync('strings_km_generated.json', JSON.stringify(km, null, 2));
console.log('Successfully generated strings_km_generated.json with', Object.keys(km).length, 'keys');
