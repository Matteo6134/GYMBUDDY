import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs
      blurEffect="systemChromeMaterialDark"
      tintColor="#FFFFFF"
    >
      <NativeTabs.Trigger name="index">
        <Label>Workouts</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'dumbbell', selected: 'dumbbell.fill' }} />,
          default: <Icon src={<VectorIcon family={FontAwesome5} name="dumbbell" />} />,
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Profile</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'person', selected: 'person.fill' }} />,
          default: <Icon src={<VectorIcon family={FontAwesome5} name="user-alt" />} />,
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
