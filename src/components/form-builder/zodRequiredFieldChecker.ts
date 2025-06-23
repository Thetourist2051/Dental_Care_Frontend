import { z } from 'zod';

/**
 * Checks if a field is required in a Zod schema with optimizations
 * @param schema The Zod schema to check
 * @param fieldPath The path to the field (dot notation for nested fields)
 * @param currentValues The current values of the form
 * @returns boolean indicating if the field is required
 */
export default function zodRequiredFieldChecker<T extends z.ZodType>(
  schema: T,
  fieldPath: string,
  currentValues: Record<string, any> = {}
): boolean {
  // Handle nested paths
  const pathParts = fieldPath.split('.');
  const fieldName = pathParts[0];

  // Special case: if we're dealing with a direct object schema
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();

    // If it's a nested path, handle recursively
    if (pathParts.length > 1) {
      const nestedField = shape[fieldName];

      // Ensure the parent field exists and is an object schema
      if (nestedField instanceof z.ZodObject) {
        const nestedPath = pathParts.slice(1).join('.');
        const nestedValues = currentValues[fieldName] || {};
        return zodRequiredFieldChecker(nestedField, nestedPath, nestedValues);
      }

      // If parent is an optional object, the nested field can't be required
      if (nestedField instanceof z.ZodOptional) {
        return false;
      }
    }

    // Direct field check: examine the schema definition directly
    const fieldSchema = shape[fieldName];

    // If field doesn't exist in schema, it's not required
    if (!fieldSchema) return false;

    // Check if the field is wrapped in .optional() or .nullable()
    if (fieldSchema instanceof z.ZodOptional || fieldSchema instanceof z.ZodNullable) {
      return false;
    }

    // For conditional requirements (when using .refine, .superRefine, etc.)
    // we need to test actual validation
    if (
      fieldSchema instanceof z.ZodEffects ||
      schema instanceof z.ZodEffects ||
      (schema._def.catchall !== undefined && schema._def.catchall instanceof z.ZodType)
    ) {
      // Fall back to validation test approach
      return validateByTest(schema, fieldPath, currentValues);
    }

    // If none of the above, the field is required
    return true;
  }

  // For complex schemas or unions, fall back to validation testing
  return validateByTest(schema, fieldPath, currentValues);
}

/**
 * Helper function that validates by testing the schema
 */
function validateByTest<T extends z.ZodType>(schema: T, fieldPath: string, currentValues: Record<string, any>): boolean {
  try {
    // Create a deep copy to avoid mutations
    const testValues = JSON.parse(JSON.stringify(currentValues));

    // Remove the field we're checking
    const pathParts = fieldPath.split('.');
    let current = testValues;

    // Navigate to the right level for nested fields
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) return false; // If the parent doesn't exist, field can't be required
      current = current[part];
    }

    // Delete the field
    const lastPart = pathParts[pathParts.length - 1];
    delete current[lastPart];

    // Try to validate without the field
    schema.parse(testValues);

    // If validation passes without the field, it's not required
    return false;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Examine the error paths to see if our field is the issue
      return error.errors.some((err) => {
        // Check for missing required field errors
        const errPath = err.path.join('.');
        return errPath === fieldPath && err.code === 'invalid_type' && err.message.includes('Required');
      });
    }

    // Default to false for other errors
    return false;
  }
}
