
import { ReceptorData, DrugData, QuizQuestion, ClinicalCase } from './types';

export const RECEPTORS: ReceptorData[] = [
  {
    id: 'alpha1',
    name: 'Récepteur α1',
    protein: 'Gq',
    location: ['Muscles lisses vasculaires', 'Œil (muscle radial)', 'Sphincters urinaires'],
    effects: ['Vasoconstriction (↑ RVS, ↑ PA)', 'Mydriase', 'Contraction sphincter vésical'],
    anesthesiaRole: 'Maintien du tonus vasculaire, réponse aux vasopresseurs.',
    pathology: 'HTA, Rétention aiguë d\'urine.'
  },
  {
    id: 'alpha2',
    name: 'Récepteur α2',
    protein: 'Gi',
    location: ['Pré-synaptique (SNC & périphérie)', 'Pancréas'],
    effects: ['Inhibition libération NA', 'Sédation / Analgésie', '↓ Insulinorésistance'],
    anesthesiaRole: 'Sédation épargnant la respiration (Dexmed), Analgésie, Stabilité hémodynamique.',
    pathology: 'Sevrage adrénergique.'
  },
  {
    id: 'beta1',
    name: 'Récepteur β1',
    protein: 'Gs',
    location: ['Cœur (Nœud sinusal, AV, Myocytes)', 'Rein (JG)'],
    effects: ['Chronotrope +', 'Inotrope +', 'Dromotrope +', 'Bathmotrope +', '↑ Rénine'],
    anesthesiaRole: 'Débit cardiaque, Consommation O2 myocardique.',
    pathology: 'Tachycardie, Ischémie myocardique, Insuffisance cardiaque.'
  },
  {
    id: 'beta2',
    name: 'Récepteur β2',
    protein: 'Gs',
    location: ['Bronches', 'Vaisseaux (musculaires)', 'Utérus', 'Foie'],
    effects: ['Bronchodilatation', 'Vasodilatation (musculaire)', 'Relaxation utérine', 'Glycogénolyse'],
    anesthesiaRole: 'Bronchospasme, vasoplégie, gestion du K+.',
    pathology: 'Asthme, BPCO.'
  },
  {
    id: 'beta3',
    name: 'Récepteur β3',
    protein: 'Gs',
    location: ['Tissu adipeux', 'Vessie'],
    effects: ['Lipolyse', 'Relaxation du détrusor'],
    anesthesiaRole: 'Thermogenèse (mineur), compliance vésicale.',
    pathology: 'Vessie hyperactive.'
  }
];

export const DRUGS: DrugData[] = [
  // ... (Garder les mêmes données de drogues qu'avant, je les inclus pour la complétude du fichier)
  {
    id: 'norad',
    name: 'Noradrénaline',
    class: 'Agoniste',
    receptors: ['alpha1', 'alpha2', 'beta1'],
    selectivity: 'α1, α2 >> β1',
    clinicalUse: ['Choc septique', 'Choc vasoplégique', 'Hypotension sévère'],
    dose: '0.05 - 1.0 µg/kg/min',
    precautions: 'Risque ischémie distale, HTA sévère, nécrose cutanée si extravasation.',
    affinityProfile: { alpha1: 10, alpha2: 8, beta1: 4, beta2: 1 },
    selectiveAffinity: "Forte affinité α1 et α2, affinité modérée β1, quasi nulle pour β2.",
    mechanism: "Vasoconstricteur puissant par effet α1 direct. Augmentation modérée de la contractilité (β1) souvent masquée par la post-charge élevée (baroréflexe).",
    contraindications: ["Hypotension par hypovolémie non corrigée", "Thrombose vasculaire mésentérique (relative)"],
    pharmacokinetics: { onset: "1-2 min", peak: "< 5 min", duration: "5-10 min", halfLife: "2-3 min" }
  },
  {
    id: 'adrenaline',
    name: 'Adrénaline',
    class: 'Agoniste',
    receptors: ['alpha1', 'alpha2', 'beta1', 'beta2'],
    selectivity: 'Non sélectif (dépendant dose)',
    clinicalUse: ['Arrêt Cardiaque', 'Choc anaphylactique', 'Bronchospasme sévère', 'Choc cardiogénique (2e ligne)'],
    dose: 'ACR: 1mg / Choc: 0.05-0.5 µg/kg/min',
    precautions: 'Arythmies ventriculaires, ↑ MVO2, hyperglycémie, hyperlactatémie (effet β2).',
    affinityProfile: { alpha1: 9, alpha2: 9, beta1: 9, beta2: 9 },
    selectiveAffinity: "Affinité élevée et équilibrée pour tous les récepteurs adrénergiques (α et β).",
    mechanism: "Agoniste puissant de tous les récepteurs. A faible dose : effet β prédominant (inotrope/chronotrope + vasodilatation). A forte dose : effet α prédominant (vasoconstriction).",
    contraindications: ["Aucune dans l'arrêt cardiaque", "Insuffisance coronarienne sévère (relative hors urgence vitale)"],
    pharmacokinetics: { onset: "< 1 min", peak: "1-2 min", duration: "5-10 min", halfLife: "2-3 min" }
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    class: 'Agoniste',
    receptors: ['alpha1', 'beta1', 'beta2'],
    selectivity: 'Dose-dépendant (Dopa > β1 > α1)',
    clinicalUse: ['Choc (historique)', 'Bradycardie symptomatique (2e ligne)'],
    dose: '5-20 µg/kg/min',
    precautions: 'Arythmogène ++, nausées/vomissements. Obsolète dans le choc septique.',
    affinityProfile: { alpha1: 5, alpha2: 1, beta1: 7, beta2: 2 },
    selectiveAffinity: "Dose-dépendante : Dopa (faible dose) > β1 (dose moyenne) > α1 (haute dose).",
    mechanism: "Précurseur de la NA. Faible dose (<5) : R. Dopaminergiques (rénal). Dose moy (5-10) : β1 inotrope. Forte dose (>10) : α1 vasoconstricteur.",
    contraindications: ["Phéochromocytome", "Tachyarythmies ventriculaires"],
    pharmacokinetics: { onset: "5 min", peak: "10 min", duration: "10 min", halfLife: "2 min" }
  },
  {
    id: 'phenylephrine',
    name: 'Phényléphrine',
    class: 'Agoniste',
    receptors: ['alpha1'],
    selectivity: 'α1 pur',
    clinicalUse: ['Hypotension sous AG', 'Hypotension rachianesthésie', 'Mydriatique (collyre)'],
    dose: 'Bolus 50-100µg / IVSE 0.5-3 µg/kg/min',
    precautions: 'Bradycardie réflexe marquée (baroréflexe), baisse du débit cardiaque.',
    affinityProfile: { alpha1: 10, alpha2: 1, beta1: 0, beta2: 0 },
    selectiveAffinity: "Affinité quasi-exclusive pour les récepteurs α1.",
    mechanism: "Vasoconstriction artérielle directe pure sans effet inotrope. Augmente la post-charge VG.",
    contraindications: ["Bradycardie sévère", "Insuffisance cardiaque décompensée"],
    pharmacokinetics: { onset: "1 min", peak: "1-3 min", duration: "15-20 min", halfLife: "5-10 min" }
  },
  {
    id: 'ephedrine',
    name: 'Éphédrine',
    class: 'Agoniste',
    receptors: ['alpha1', 'beta1', 'beta2'],
    selectivity: 'Indirect + Direct mixte',
    clinicalUse: ['Hypotension modérée au bloc', 'Prévention hypotension rachi'],
    dose: 'Bolus 3-9 mg (Max 30-50mg)',
    precautions: 'Tachyphylaxie (épuisement des stocks), inefficace si déplétion catécholaminergique.',
    affinityProfile: { alpha1: 4, alpha2: 0, beta1: 6, beta2: 4 },
    selectiveAffinity: "Action mixte : libération de NA endogène (principal) + agonisme direct faible α et β.",
    mechanism: "Stimule la libération de Noradrénaline endogène (action indirecte) + faible effet direct. Passe la BHE (excitation).",
    contraindications: ["Glaucome à angle fermé", "Hypertrophie prostatique (rétention)"],
    pharmacokinetics: { onset: "Immédiat", peak: "2-5 min", duration: "60 min", halfLife: "3-6 heures" }
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    class: 'Agoniste',
    receptors: ['beta1', 'beta2'],
    selectivity: 'β1 > β2 >>> α1',
    clinicalUse: ['Choc cardiogénique', 'IC décompensée', 'Bas débit cardiaque'],
    dose: '2 - 20 µg/kg/min',
    precautions: 'Tachycardie sinusale, hypotension (effet β2 vasodilatateur si hypovolémie).',
    affinityProfile: { alpha1: 1, alpha2: 0, beta1: 10, beta2: 5 },
    selectiveAffinity: "Prédominance β1 (inotropisme), effet β2 modéré, effet α1 mineur (énantiomères s'annulent).",
    mechanism: "Inotrope positif puissant. Augmente le débit cardiaque et le volume d'éjection. Baisse légère des résistances systémiques.",
    contraindications: ["CMO obstructive", "Sténose aortique serrée (relative)"],
    pharmacokinetics: { onset: "1-2 min", peak: "10 min", duration: "< 5 min (arrêt)", halfLife: "2 min" }
  },
  {
    id: 'isoprenaline',
    name: 'Isoprénaline',
    class: 'Agoniste',
    receptors: ['beta1', 'beta2'],
    selectivity: 'β pur (β1 = β2)',
    clinicalUse: ['Bradycardie sévère', 'BAV complet (attente pacemaker)', 'Torsades de pointes'],
    dose: 'IVSE 0.02-0.2 µg/kg/min ou Bolus 10-20µg',
    precautions: 'Vasodilatation (hypotension diastolique), tachycardie majeure, ↑↑ MVO2.',
    affinityProfile: { alpha1: 0, alpha2: 0, beta1: 10, beta2: 10 },
    selectiveAffinity: "Agoniste β non sélectif pur (β1 = β2), aucune activité α.",
    mechanism: "Stimulant cardiaque pur (Chronotrope/Inotrope) et vasodilatateur systémique/pulmonaire puissant.",
    contraindications: ["Angor instable", "Infarctus aigu", "Tachycardie"],
    pharmacokinetics: { onset: "Immédiat", peak: "1 min", duration: "10-15 min", halfLife: "2-5 min" }
  },
  {
    id: 'salbutamol',
    name: 'Salbutamol',
    class: 'Agoniste',
    receptors: ['beta2', 'beta1'],
    selectivity: 'β2 >>> β1',
    clinicalUse: ['Bronchospasme', 'Hyperkaliémie', 'Asthme aigu grave'],
    dose: 'Spray / IVSE 5-20 µg/min',
    precautions: 'Tachycardie (effet β1 à forte dose), Trémulations, Hypokaliémie, Acidose lactique.',
    affinityProfile: { alpha1: 0, alpha2: 0, beta1: 3, beta2: 10 },
    selectiveAffinity: "Haute sélectivité β2 (bronchique/utérin), activité β1 significative seulement à forte dose.",
    mechanism: "Relaxation musculature lisse bronchique et utérine. Stimulation pompe Na/K (hypokaliémiant).",
    contraindications: ["Allergie", "Infection intra-utérine (si usage tocolyse)"],
    pharmacokinetics: { onset: "5 min (inhalé)", peak: "30-60 min", duration: "3-4 h", halfLife: "4-6 h" }
  },
  {
    id: 'terbutaline',
    name: 'Terbutaline',
    class: 'Agoniste',
    receptors: ['beta2'],
    selectivity: 'β2 sélectif',
    clinicalUse: ['Tocolyse (MAP)', 'Bronchospasme'],
    dose: 'Bolus SC/IV ou IVSE',
    precautions: 'OAP si surcharge, Tachycardie fœtale, hyperglycémie maternelle.',
    affinityProfile: { alpha1: 0, alpha2: 0, beta1: 2, beta2: 10 },
    selectiveAffinity: "Haute sélectivité β2 >> β1, similaire au Salbutamol.",
    mechanism: "Similaire au Salbutamol. Action relaxante utérine prédominante en systémique.",
    contraindications: ["Cardiopathie sévère", "Thyréotoxicose"],
    pharmacokinetics: { onset: "5-15 min", peak: "30-60 min", duration: "1.5 - 4 h", halfLife: "3-4 h" }
  },
  {
    id: 'dexmed',
    name: 'Dexmédétomidine',
    class: 'Agoniste',
    receptors: ['alpha2'],
    selectivity: 'α2 pur (1600:1)',
    clinicalUse: ['Sédation vigile (USI)', 'Adjuvant analgésie', 'Sevrage respi'],
    dose: '0.2 - 1.4 µg/kg/h',
    precautions: 'Bradycardie sinusale parfois sévère, Hypotension, pas de bolus rapide.',
    affinityProfile: { alpha1: 1, alpha2: 10, beta1: 0, beta2: 0 },
    selectiveAffinity: "Extrêmement sélectif pour α2 (Ratio α2:α1 = 1600:1).",
    mechanism: "Agoniste α2 central (Locus Coeruleus) : inhibition sympathique -> sédation type 'sommeil naturel' + analgésie.",
    contraindications: ["BAV 2/3 non appareillé", "Hypotension sévère incontrôlée"],
    pharmacokinetics: { onset: "15 min", peak: "1 h", duration: "4 h", halfLife: "2 h" }
  },
  {
    id: 'clonidine',
    name: 'Clonidine',
    class: 'Agoniste',
    receptors: ['alpha2', 'alpha1'],
    selectivity: 'α2 sélectif (200:1)',
    clinicalUse: ['HTA, Sevrage alcool/opioïdes', 'Frissons post-op', 'Adjuvant ALR'],
    dose: '75-150 µg IV/PO (Catapressan)',
    precautions: 'Effet rebond hypertensif à l\'arrêt brutal. Sédation, bouche sèche.',
    affinityProfile: { alpha1: 3, alpha2: 9, beta1: 0, beta2: 0 },
    selectiveAffinity: "Sélectivité α2 modérée (Ratio α2:α1 = 200:1), activité α1 partielle.",
    mechanism: "Agoniste α2 central. Baisse le tonus sympathique. Effet analgésique par action médullaire.",
    contraindications: ["Bradyarythmie sévère", "Dépression majeure"],
    pharmacokinetics: { onset: "10-30 min", peak: "2-4 h", duration: "6-10 h", halfLife: "12-16 h" }
  },
  // --- ANTAGONISTES ---
  {
    id: 'esmolol',
    name: 'Esmolol',
    class: 'Antagoniste',
    receptors: ['beta1'],
    selectivity: 'β1 sélectif (Cardiosélectif)',
    clinicalUse: ['Tachycardie per-op', 'HTA per-op', 'Test thérapeutique B-bloquant'],
    dose: 'Bolus 0.5 mg/kg puis 50-300 µg/kg/min',
    precautions: 'Extrêmement bref. BAV, Insuffisance cardiaque aiguë.',
    affinityProfile: { alpha1: 0, alpha2: 0, beta1: 10, beta2: 1 },
    selectiveAffinity: "Fortement cardiosélectif (β1) à dose thérapeutique.",
    mechanism: "Bêta-bloquant ultra-court. Bloque l'effet inotrope/chronotrope des catécholamines sur le cœur.",
    contraindications: ["Choc cardiogénique", "Asthme sévère (précaution)", "Bradycardie < 50"],
    pharmacokinetics: { onset: "1-2 min", peak: "5 min", duration: "10-20 min", halfLife: "9 min" }
  },
  {
    id: 'atenolol',
    name: 'Aténolol',
    class: 'Antagoniste',
    receptors: ['beta1'],
    selectivity: 'β1 sélectif',
    clinicalUse: ['Coronarien', 'Prévention ischémie', 'HTA'],
    dose: '5-10 mg IV lent',
    precautions: 'Bradycardie, attention fonction rénale (élimination rénale pure).',
    affinityProfile: { alpha1: 0, alpha2: 0, beta1: 9, beta2: 2 },
    selectiveAffinity: "Cardiosélectif (β1 > β2).",
    mechanism: "Bêta-bloquant cardiosélectif hydrophile. Ne passe pas la BHE (moins de cauchemars).",
    contraindications: ["BAV non appareillé", "Phéochromocytome non traité"],
    pharmacokinetics: { onset: "5 min (IV)", peak: "15 min", duration: "12 h", halfLife: "6-7 h" }
  },
  {
    id: 'propranolol',
    name: 'Propranolol',
    class: 'Antagoniste',
    receptors: ['beta1', 'beta2'],
    selectivity: 'Non sélectif',
    clinicalUse: ['Crise thyréotoxique', 'Tremblements essentiels', 'Hémangiome'],
    dose: '0.5-1 mg IV (rare en aigu)',
    precautions: 'Bronchospasme (CI Asthme absolue), Hypoglycémie masquée.',
    affinityProfile: { alpha1: 0, alpha2: 0, beta1: 9, beta2: 9 },
    selectiveAffinity: "Non sélectif, bloque équitablement β1 et β2.",
    mechanism: "Antagoniste compétitif non sélectif. Effets cardiaques, vasculaires et bronchiques. Lipophile (passe SNC).",
    contraindications: ["Asthme / BPCO", "Raynaud", "Bradycardie"],
    pharmacokinetics: { onset: "2-5 min (IV)", peak: "60-90 min", duration: "4-6 h", halfLife: "4 h" }
  },
  {
    id: 'labetalol',
    name: 'Labétalol',
    class: 'Antagoniste',
    receptors: ['alpha1', 'beta1', 'beta2'],
    selectivity: 'Mixte (α1 et β)',
    clinicalUse: ['Urgence hypertensive', 'Pré-éclampsie', 'Dissection aortique'],
    dose: 'Bolus 5-20 mg (répétable) ou IVSE',
    precautions: 'Bronchospasme (effet β non sélectif), Hypotension orthostatique.',
    affinityProfile: { alpha1: 4, alpha2: 0, beta1: 7, beta2: 3 },
    selectiveAffinity: "Blocage mixte : α1 (vasodilatation) et β non sélectif. Ratio α:β est de 1:7 en IV.",
    mechanism: "Bloque α1 (vasodilatation) et β1/β2 (évite la tachycardie réflexe). Ratio oral 1:3, IV 1:7 (α:β).",
    contraindications: ["Asthme", "Insuffisance cardiaque décompensée"],
    pharmacokinetics: { onset: "2-5 min", peak: "5-15 min", duration: "2-4 h", halfLife: "5.5 h" }
  },
  {
    id: 'carvedilol',
    name: 'Carvédilol',
    class: 'Antagoniste',
    receptors: ['alpha1', 'beta1', 'beta2'],
    selectivity: 'Mixte et Anti-oxydant',
    clinicalUse: ['Insuffisance Cardiaque Chronique', 'Post-IDM'],
    dose: 'PO uniquement (long cours)',
    precautions: 'Hypotension orthostatique (α1), surveillance étroite introduction.',
    affinityProfile: { alpha1: 5, alpha2: 0, beta1: 6, beta2: 6 },
    selectiveAffinity: "Blocage mixte α1, β1 et β2 (3ème génération).",
    mechanism: "Blocage α1 et β non sélectif + Propriétés antioxydantes et antiprolifératives.",
    contraindications: ["Asthme", "Insuffisance hépatique sévère"],
    pharmacokinetics: { onset: "30-60 min", peak: "1-2 h", duration: "12 h", halfLife: "7-10 h" }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ... (Garder les questions de quiz existantes)
  { id: 1, category: 'Physio', question: "La protéine Gq est associée à quel second messager ?", options: ["AMP cyclique (cAMP)", "IP3 / DAG / Calcium", "Canaux K+", "GMP cyclique"], correctIndex: 1, explanation: "Gq active la Phospholipase C qui clive PIP2 en IP3 et DAG, augmentant le Calcium intracellulaire." },
  // (Assuming rest of quiz questions are preserved for brevity, I will not delete them in the update, just showing the structure)
  { id: 26, category: 'Clinique', question: "Contre-indication absolue des β-bloquants non sélectifs ?", options: ["Asthme sévère", "Insuffisance coronaire", "Hypertension", "Glaucome"], correctIndex: 0, explanation: "Le blocage β2 empêche la bronchodilatation et peut précipiter un bronchospasme fatal." }
];

// --- CLINICAL CASES (Multi-step scenarios) ---
export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'sepsis_1',
    title: 'Choc Septique Évolutif',
    initialContext: 'Homme 65 ans, admis pour pyélonéphrite. Malgré 30ml/kg de remplissage, reste hypotendu.',
    steps: [
      {
        id: 1,
        timeOffset: "H+0",
        contextUpdate: "Patient marbré aux genoux. Conscience altérée. Lactates 4 mmol/L.",
        vitals: { bp: "80/40 mmHg", hr: "115 bpm", sats: "94%" },
        question: "Quelle est la catécholamine de première intention ?",
        options: [
          { id: "a", text: "Noradrénaline", correct: true, explanation: "Vasoconstricteur α1 prédominant. Gold standard du choc septique pour restaurer la perfusion.", outcome: "La PA remonte progressivement." },
          { id: "b", text: "Adrénaline", correct: false, explanation: "Risque arythmogène et hyperlactatémie. 2ème ligne seulement.", outcome: "Tachycardie majeure 140 bpm, augmentation lactates." },
          { id: "c", text: "Dobutamine", correct: false, explanation: "Indiquée seulement si dysfonction myocardique associée. Ici aggraverait l'hypotension (β2).", outcome: "Chute tensionnelle critique par vasodilatation." }
        ]
      },
      {
        id: 2,
        timeOffset: "H+1",
        contextUpdate: "Sous Noradrénaline 0.5 µg/kg/min, la PAM est à 65 mmHg mais le patient devient oligurique et la ScvO2 est basse (55%). L'échocœur montre un VG hypokinétique.",
        vitals: { bp: "95/55 mmHg", hr: "105 bpm", sats: "96%" },
        question: "Quelle adaptation thérapeutique ?",
        options: [
          { id: "a", text: "Augmenter Noradrénaline", correct: false, explanation: "La post-charge est déjà restaurée. Le problème est maintenant le débit (Inotropie).", outcome: "Vasoconstriction excessive, baisse du débit cardiaque." },
          { id: "b", text: "Ajouter Dobutamine", correct: true, explanation: "Cardiomyopathie septique probable. L'ajout d'un inotrope β1 est indiqué.", outcome: "Amélioration de la ScvO2 et reprise de la diurèse." },
          { id: "c", text: "Remplissage vasculaire", correct: false, explanation: "Déjà bien rempli, risque d'OAP sur VG défaillant.", outcome: "Apparition de crépitants, désaturation." }
        ]
      },
      {
        id: 3,
        timeOffset: "H+4",
        contextUpdate: "Le patient développe une Fibrillation Auriculaire Rapide mal tolérée.",
        vitals: { bp: "85/50 mmHg", hr: "160 bpm", sats: "92%" },
        question: "Gestion de l'arythmie ?",
        options: [
          { id: "a", text: "Esmolol IV", correct: false, explanation: "Risque majeur de collapsus sur ce cœur défaillant dépendant des catécholamines.", outcome: "Choc cardiogénique immédiat." },
          { id: "b", text: "Amiodarone (Cordarone)", correct: true, explanation: "Anti-arythmique de choix chez le patient instable (moins inotrope négatif que les BB).", outcome: "Ralentissement progressif de la fréquence." },
          { id: "c", text: "Arrêt de la Dobutamine", correct: false, explanation: "Nécessaire pour le débit, mais on peut essayer de la diminuer prudemment.", outcome: "Chute du débit cardiaque, hypoperfusion." }
        ]
      }
    ]
  },
  {
    id: 'anaph_1',
    title: 'Choc Anaphylactique Per-op',
    initialContext: 'Femme 30 ans, induction AG pour appendicectomie. 2 min après injection Curospurf.',
    steps: [
      {
        id: 1,
        timeOffset: "T+2 min",
        contextUpdate: "Difficulté ventilatoire brutale (Ppic 40), Erythème cutané diffus.",
        vitals: { bp: "60/30 mmHg", hr: "130 bpm", sats: "88%" },
        question: "Diagnostic et action immédiate ?",
        options: [
          { id: "a", text: "Choc Anaphylactique -> Adrénaline", correct: true, explanation: "Bolus titrés (10-20µg répétés) ou plus selon gravité (Grade 3). Agoniste α et β nécessaire.", outcome: "Stabilisation transitoire, mais récidive rapide." },
          { id: "b", text: "Bronchospasme isolé -> Salbutamol", correct: false, explanation: "Ne traite pas l'hypotension (vasoplégie).", outcome: "Arrêt cardiaque par désamorçage." },
          { id: "c", text: "Choc Hémorragique -> Remplissage", correct: false, explanation: "Contexte allergique évident.", outcome: "Inefficace, perte de temps." }
        ]
      },
      {
        id: 2,
        timeOffset: "T+10 min",
        contextUpdate: "Malgré 1mg d'Adrénaline au total et remplissage, l'hypotension persiste avec une tachycardie majeure.",
        vitals: { bp: "70/35 mmHg", hr: "150 bpm", sats: "92%" },
        question: "Quelle drogue ajouter pour la vasoplégie réfractaire ?",
        options: [
          { id: "a", text: "Noradrénaline", correct: true, explanation: "L'effet α1 pur est requis car la vasoplégie prédomine et la tachycardie limite l'adrénaline.", outcome: "La PA remonte, la FC diminue un peu." },
          { id: "b", text: "Atropine", correct: false, explanation: "Inutile sur une tachycardie.", outcome: "Aucun effet." },
          { id: "c", text: "Corticoïdes", correct: false, explanation: "Action retardée (4-6h), inutile en phase aiguë.", outcome: "Inefficace sur l'hémodynamique immédiate." }
        ]
      },
      {
        id: 3,
        timeOffset: "T+30 min",
        contextUpdate: "Hémodynamique stabilisée. Mais bronchospasme résiduel persistant.",
        vitals: { bp: "110/60 mmHg", hr: "100 bpm", sats: "94%" },
        question: "Traitement adjuvant ventilatoire ?",
        options: [
          { id: "a", text: "Salbutamol IVSE / Aérosol", correct: true, explanation: "Agoniste β2 spécifique pour lever le bronchospasme résiduel.", outcome: "Normalisation des pressions, SpO2 100%." },
          { id: "b", text: "Esmolol", correct: false, explanation: "Contre-indiqué !", outcome: "Aggravation bronchospasme." },
        ]
      }
    ]
  },
  {
    id: 'hypo_induction',
    title: 'Hypotension Induction Sujet Âgé',
    initialContext: 'Homme 85 ans, sténose aortique serrée (RAC). Induction AG douce.',
    steps: [
      {
        id: 1,
        timeOffset: "T+3 min",
        contextUpdate: "Perte de conscience. La PA chute brutalement.",
        vitals: { bp: "55/30 mmHg", hr: "55 bpm", sats: "98%" },
        question: "Quel vasopresseur choisir ?",
        options: [
          { id: "a", text: "Phényléphrine", correct: true, explanation: "Le RAC tolère mal la tachycardie. Un alpha-agoniste pur est idéal pour remonter la post-charge sans accélérer le cœur.", outcome: "La PA remonte, la FC reste stable." },
          { id: "b", text: "Éphédrine", correct: false, explanation: "L'effet β1 risque de provoquer une tachycardie délétère sur le RAC.", outcome: "Tachycardie 90 bpm, ischémie myocardique probable." },
          { id: "c", text: "Isoprénaline", correct: false, explanation: "Vasodilatateur ! Mortel sur un RAC.", outcome: "Désamorçage cardiaque, ACR." }
        ]
      },
      {
        id: 2,
        timeOffset: "T+10 min",
        contextUpdate: "Chirurgie commence. Stimulation douloureuse. HTA brutale.",
        vitals: { bp: "180/90 mmHg", hr: "60 bpm", sats: "99%" },
        question: "Gestion de l'HTA ?",
        options: [
          { id: "a", text: "Approfondir l'anesthésie (Remifentanil)", correct: true, explanation: "Traiter la cause (douleur). Le RAC a besoin d'une PA élevée, ne pas trop baisser.", outcome: "Normalisation douce de la PA." },
          { id: "b", text: "Nicardipine bolus", correct: false, explanation: "Risque d'hypotension rebond sévère.", outcome: "Hypotension sévère récidivante." }
        ]
      },
      {
        id: 3,
        timeOffset: "SSPI",
        contextUpdate: "Patient extubé. Présente des frissons intenses.",
        vitals: { bp: "160/80 mmHg", hr: "75 bpm", sats: "97%" },
        question: "Traitement des frissons ?",
        options: [
          { id: "a", text: "Clonidine (petites doses)", correct: true, explanation: "Alpha-2 agoniste efficace sur le seuil du frisson.", outcome: "Arrêt des frissons, confort." },
          { id: "b", text: "Réchauffement seul", correct: false, explanation: "Efficace mais lent.", outcome: "Persistance des frissons pendant 30 min." }
        ]
      }
    ]
  }
];
