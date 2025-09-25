import { SimpleMessagesProvider } from '@vinejs/vine'

export class CustomVineMessagesProvider extends SimpleMessagesProvider {
  constructor() {
    super({
      // Required field messages
      'required': 'Le champ {{ field }} est requis',

      // String validations
      'string': 'Le champ {{ field }} doit être une chaîne de caractères',
      'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
      'maxLength': 'Le champ {{ field }} ne peut pas dépasser {{ max }} caractères',
      'string.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
      'string.maxLength': 'Le champ {{ field }} ne peut pas dépasser {{ max }} caractères',
      'string.fixedLength': 'Le champ {{ field }} doit contenir exactement {{ size }} caractères',
      'string.trim': "Le champ {{ field }} ne doit pas contenir d'espaces au début ou à la fin",

      // Email validation
      'string.email': 'Le champ {{ field }} doit être une adresse email valide',

      // URL validation
      'string.url': 'Le champ {{ field }} doit être une URL valide',

      // Number validations
      'number': 'Le champ {{ field }} doit être un nombre',
      'number.min': 'Le champ {{ field }} doit être supérieur ou égal à {{ min }}',
      'number.max': 'Le champ {{ field }} doit être inférieur ou égal à {{ max }}',
      'number.range': 'Le champ {{ field }} doit être compris entre {{ min }} et {{ max }}',
      'number.positive': 'Le champ {{ field }} doit être un nombre positif',
      'number.negative': 'Le champ {{ field }} doit être un nombre négatif',

      // Boolean validation
      'boolean': 'Le champ {{ field }} doit être true ou false',

      // Date validations
      'date': 'Le champ {{ field }} doit être une date valide',
      'date.format': 'Le champ {{ field }} doit respecter le format {{ format }}',
      'date.before': 'Le champ {{ field }} doit être antérieur au {{ before }}',
      'date.after': 'Le champ {{ field }} doit être postérieur au {{ after }}',
      'date.beforeOrEqual':
        'Le champ {{ field }} doit être antérieur ou égal au {{ beforeOrEqual }}',
      'date.afterOrEqual':
        'Le champ {{ field }} doit être postérieur ou égal au {{ afterOrEqual }}',

      // Array validations
      'array': 'Le champ {{ field }} doit être un tableau',
      'array.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} éléments',
      'array.maxLength': 'Le champ {{ field }} ne peut pas contenir plus de {{ max }} éléments',
      'array.fixedLength': 'Le champ {{ field }} doit contenir exactement {{ size }} éléments',

      // Object validation
      'object': 'Le champ {{ field }} doit être un objet',

      // Database validations
      'database.unique': 'Le champ {{ field }} doit être unique. Cette valeur est déjà utilisée',
      'database.exists': "Le champ {{ field }} fait référence à un enregistrement qui n'existe pas",

      // File validations
      'file': 'Le champ {{ field }} doit être un fichier',
      'file.size': 'Le fichier {{ field }} doit faire moins de {{ size }}',
      'file.extname': "Le fichier {{ field }} doit avoir l'extension {{ extnames }}",

      // Enum validation
      'enum': 'Le champ {{ field }} doit être une des valeurs suivantes : {{ choices }}',

      // Accepted validation
      'accepted': 'Le champ {{ field }} doit être accepté',

      // Alpha validation
      'alpha': 'Le champ {{ field }} ne doit contenir que des lettres',
      'alphaNumeric': 'Le champ {{ field }} ne doit contenir que des lettres et des chiffres',

      // Regex validation
      'regex': "Le format du champ {{ field }} n'est pas valide",

      // UUID validation
      'uuid': 'Le champ {{ field }} doit être un UUID valide',

      // IP validation
      'ip': 'Le champ {{ field }} doit être une adresse IP valide',

      // Credit card validation
      'creditCard': 'Le champ {{ field }} doit être un numéro de carte de crédit valide',

      // Postal code validation
      'postalCode': 'Le champ {{ field }} doit être un code postal valide',

      // Mobile phone validation
      'mobile': 'Le champ {{ field }} doit être un numéro de téléphone mobile valide',

      // Same as validation
      'sameAs': 'Le champ {{ field }} doit être identique au champ {{ otherField }}',

      // Different from validation
      'notSameAs': 'Le champ {{ field }} doit être différent du champ {{ otherField }}',

      // In validation
      'in': 'Le champ {{ field }} doit être une des valeurs suivantes : {{ choices }}',

      // Not in validation
      'notIn': 'Le champ {{ field }} ne peut pas être une des valeurs suivantes : {{ choices }}',

      // Confirmed validation
      'confirmed': 'Le champ {{ field }} ne correspond pas à la confirmation',
    })
  }
}
