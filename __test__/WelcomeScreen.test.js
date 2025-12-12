import { render } from '@testing-library/react-native';
import WelcomeScreen from '../screens/home/WelcomeScreen';

// Mock pour éviter les erreurs avec les images
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

describe('WelcomeScreen Tests', () => {
  let mockNavigation;

  beforeEach(() => {
    // Mock de l'objet navigation
    mockNavigation = {
      replace: jest.fn(),
      navigate: jest.fn(),
    };

    // Mock console pour éviter les logs pendant les tests
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Clear tous les timers avant chaque test
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    console.log.mockRestore();
    jest.useRealTimers();
  });

  test('devrait rendre correctement le composant', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    // Vérifier que le titre est affiché
    expect(getByText('Bienvenue dans Murmure')).toBeTruthy();
  });

  test('devrait afficher le texte de bienvenue avec le bon style', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    const titleElement = getByText('Bienvenue dans Murmure');
    expect(titleElement.props.style).toMatchObject({
      fontSize: 15,
      fontWeight: 'bold',
      color: '#d99174',
      textAlign: 'center',
    });
  });

  test('devrait naviguer vers Home après 1200ms', () => {
    render(<WelcomeScreen navigation={mockNavigation} />);

    // Vérifier que navigation n'est pas encore appelé
    expect(mockNavigation.replace).not.toHaveBeenCalled();

    // Avancer le temps de 1200ms
    jest.advanceTimersByTime(1200);

    // Vérifier que navigation.replace a été appelé avec "Home"
    expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    expect(mockNavigation.replace).toHaveBeenCalledTimes(1);
  });

  test('ne devrait pas naviguer avant 1200ms', () => {
    render(<WelcomeScreen navigation={mockNavigation} />);

    // Avancer le temps de 1000ms (moins que 1200ms)
    jest.advanceTimersByTime(1000);

    // Vérifier que navigation n'est pas encore appelé
    expect(mockNavigation.replace).not.toHaveBeenCalled();
  });

  test('devrait logger le message au montage du composant', () => {
    render(<WelcomeScreen navigation={mockNavigation} />);

    expect(console.log).toHaveBeenCalledWith(
      '--- [WelcomeScreen] 4. Affichage du screen paysage pendant 1,5s...'
    );
  });

  test('devrait logger le message avant la navigation', () => {
    render(<WelcomeScreen navigation={mockNavigation} />);

    // Avancer le temps
    jest.advanceTimersByTime(1200);

    expect(console.log).toHaveBeenCalledWith(
      "--- [WelcomeScreen] 6. Navigation vers l'ecran principal HOME."
    );
  });

  test('devrait nettoyer le timer lors du démontage', () => {
    const { unmount } = render(<WelcomeScreen navigation={mockNavigation} />);

    // Démonter le composant
    unmount();

    // Avancer le temps après le démontage
    jest.advanceTimersByTime(1200);

    // Vérifier que navigation n'est pas appelé après le démontage
    expect(mockNavigation.replace).not.toHaveBeenCalled();
  });

  test('devrait utiliser replace au lieu de navigate', () => {
    render(<WelcomeScreen navigation={mockNavigation} />);

    jest.advanceTimersByTime(1200);

    // Vérifier que c'est bien replace qui est appelé (pas navigate)
    expect(mockNavigation.replace).toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  test('devrait avoir une ImageBackground avec la bonne source', () => {
    const { UNSAFE_getByType } = render(<WelcomeScreen navigation={mockNavigation} />);

    // Chercher l'ImageBackground
    const imageBackground = UNSAFE_getByType(require('react-native').ImageBackground);

    expect(imageBackground).toBeTruthy();
    expect(imageBackground.props.resizeMode).toBe('cover');
  });

  test('devrait gérer plusieurs montages/démontages sans erreur', () => {
    const { unmount: unmount1 } = render(<WelcomeScreen navigation={mockNavigation} />);
    unmount1();

    const { unmount: unmount2 } = render(<WelcomeScreen navigation={mockNavigation} />);
    jest.advanceTimersByTime(1200);
    unmount2();

    expect(mockNavigation.replace).toHaveBeenCalledTimes(1);
  });
});
