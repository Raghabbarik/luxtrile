import {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import Header from '../../components/Header';
import Card from '../../components/Card';

const HelpSupportScreen = ({navigation}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer:
        'Browse salons on the home screen, select a salon, choose your services, select a staff member (optional), pick a date and time slot, then confirm your booking.',
    },
    {
      question: 'Can I cancel my booking?',
      answer:
        'Yes, you can cancel your booking from the Bookings tab. Go to your booking details and tap the Cancel button. Please note that cancellation policies may vary by salon.',
    },
    {
      question: 'How do I change my profile picture?',
      answer:
        'Go to the Profile tab, tap on your profile picture, and select a new image from your gallery. The image will be uploaded automatically.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'Currently, we support cash payments at the salon. Online payment options will be available soon.',
    },
    {
      question: 'How do I find salons near me?',
      answer:
        'The app automatically detects your location and shows nearby salons. You can also use the search bar to find specific salons or filter by service categories.',
    },
    {
      question: 'Can I book multiple services at once?',
      answer:
        'Yes! When viewing salon details, you can select multiple services before proceeding to book. The total price and duration will be calculated automatically.',
    },
    {
      question: 'How do I contact a salon?',
      answer:
        'You can find the salon\'s phone number on their details page. Tap the phone icon to call them directly.',
    },
    {
      question: 'What if I need to reschedule?',
      answer:
        'Currently, you need to cancel your existing booking and create a new one. We\'re working on adding a reschedule feature soon.',
    },
    {
      question: 'How do I leave a review?',
      answer:
        'After your appointment is completed, go to the Bookings tab, select the completed booking, and tap the Review button to rate your experience.',
    },
    {
      question: 'Is my personal information secure?',
      answer:
        'Yes, we take your privacy seriously. All your personal information is encrypted and stored securely. We never share your data with third parties without your consent.',
    },
  ];

  const toggleFAQ = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Help & Support" subtitle="Frequently Asked Questions" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16, paddingBottom: 100}}>
        <Card variant="glass" className="p-6 mb-6">
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-gold-soft items-center justify-center mb-4">
              <Icon name="help-circle" size={48} color={colors.gold.primary} />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              How can we help you?
            </Text>
            <Text className="text-text-secondary text-sm text-center">
              Find answers to common questions below
            </Text>
          </View>
        </Card>

        {faqs.map((faq, index) => (
          <Card key={index} variant="glass" className="mb-3">
            <TouchableOpacity
              onPress={() => toggleFAQ(index)}
              className="p-4"
              activeOpacity={0.7}>
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base font-semibold flex-1 pr-3">
                  {faq.question}
                </Text>
                <Icon
                  name={
                    expandedIndex === index
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color={colors.gold.primary}
                />
              </View>

              {expandedIndex === index && (
                <View className="mt-3 pt-3 border-t border-dark-light/20">
                  <Text className="text-text-secondary text-sm leading-6">
                    {faq.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Card>
        ))}

        <Card variant="glass" className="p-6 mt-6">
          <View className="items-center">
            <Icon
              name="chatbubbles-outline"
              size={32}
              color={colors.gold.primary}
              className="mb-3"
            />
            <Text className="text-white text-lg font-bold mb-2">
              Still need help?
            </Text>
            <Text className="text-text-secondary text-sm text-center">
              We're here to assist you with any questions
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;
