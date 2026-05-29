export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'tags' | 'select';
  placeholder?: string;
  options?: string[];
}

export const PROFILE_FIELD_GROUPS = {
  basics: [
    { key: 'username', label: 'Username', type: 'text', placeholder: '@username' },
    { key: 'gender', label: 'Gender', type: 'text', placeholder: 'How you identify' },
    { key: 'orientation', label: 'Orientation', type: 'text', placeholder: 'Sexual orientation' },
    { key: 'city', label: 'City', type: 'text', placeholder: 'Which city?' },
    { key: 'state', label: 'State', type: 'text', placeholder: 'Which state?' },
  ],
  work: [
    { key: 'title', label: 'Job Title', type: 'text', placeholder: 'e.g. Software Engineer' },
    { key: 'company', label: 'Company', type: 'text', placeholder: 'Where do you work?' },
    { key: 'department', label: 'Department', type: 'text', placeholder: 'e.g. Engineering' },
  ],
  education: [
    { key: 'university', label: 'University', type: 'text', placeholder: 'Where did you study?' },
  ],
  about: [
    { key: 'weekendPlan', label: 'My Perfect Weekend', type: 'textarea', placeholder: 'What do you love doing?' },
    { key: 'interests', label: 'Interests', type: 'tags', placeholder: 'Add interests' },
  ],
  appearance: [
    { key: 'heightCm', label: 'Height (cm)', type: 'number', placeholder: 'e.g. 175' },
    { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'e.g. Blue' },
    { key: 'hair', label: 'Hair Color', type: 'text', placeholder: 'e.g. Brown' },
  ]
} as const;
