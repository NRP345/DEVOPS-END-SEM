
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { LogOut, RotateCcw, User, Globe } from "lucide-react";

// Define translation strings
const translations = {
  en: {
    profile: "Profile",
    settings: "Settings",
    accountInformation: "Account Information",
    name: "Name",
    email: "Email",
    language: "Language",
    theme: "Theme",
    english: "English",
    hindi: "Hindi",
    light: "Light",
    dark: "Dark",
    system: "System",
    dangerZone: "Danger Zone",
    resetAppData: "Reset App Data",
    resetAppDataDescription: "This will delete all your financial data. This action cannot be undone.",
    resetConfirmation: "Are you sure you want to reset all data?",
    resetConfirmationDescription: "This will permanently delete all your expenses, savings goals, and investments.",
    reset: "Reset",
    cancel: "Cancel",
    logout: "Logout",
    resetSuccess: "All data has been reset successfully.",
  },
  hi: {
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    accountInformation: "खाता जानकारी",
    name: "नाम",
    email: "ईमेल",
    language: "भाषा",
    theme: "थीम",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    light: "लाइट",
    dark: "डार्क",
    system: "सिस्टम",
    dangerZone: "खतरा क्षेत्र",
    resetAppData: "ऐप डेटा रीसेट करें",
    resetAppDataDescription: "यह आपके सभी वित्तीय डेटा को हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती है।",
    resetConfirmation: "क्या आप वाकई सभी डेटा रीसेट करना चाहते हैं?",
    resetConfirmationDescription: "यह आपके सभी खर्चों, बचत लक्ष्यों और निवेशों को स्थायी रूप से हटा देगा।",
    reset: "रीसेट",
    cancel: "रद्द करें",
    logout: "लॉगआउट",
    resetSuccess: "सभी डेटा सफलतापूर्वक रीसेट कर दिया गया है।",
  }
};

const Profile = () => {
  const { user, logout, updateLanguage } = useUser();
  const { theme, setTheme } = useTheme();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [t, setT] = useState(() => translations[user?.language || 'en']);

  useEffect(() => {
    if (user) {
      setT(translations[user.language || 'en']);
    }
  }, [user]);

  const handleLanguageChange = (value: 'en' | 'hi') => {
    updateLanguage(value);
    setT(translations[value]);
  };

  const handleResetAppData = () => {
    if (!user) return;
    
    // Clear all financial data
    localStorage.removeItem(`fintrack_expenses_${user.id}`);
    localStorage.removeItem(`fintrack_savings_${user.id}`);
    localStorage.removeItem(`fintrack_investments_${user.id}`);
    
    // Initialize empty data structures
    localStorage.setItem(`fintrack_expenses_${user.id}`, JSON.stringify([]));
    localStorage.setItem(`fintrack_savings_${user.id}`, JSON.stringify([]));
    localStorage.setItem(`fintrack_investments_${user.id}`, JSON.stringify([]));
    
    setIsResetDialogOpen(false);
    toast.success(t.resetSuccess);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t.profile}</h1>
        <p className="text-muted-foreground">{t.settings}</p>
      </header>

      {/* Account Information */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>{t.accountInformation}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">{t.name}</Label>
              <Input id="name" value={user.name} readOnly className="mt-1 bg-muted" />
            </div>
            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" value={user.email} readOnly className="mt-1 bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>{t.settings}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="language">{t.language}</Label>
            <Select
              value={user.language}
              onValueChange={(value: 'en' | 'hi') => handleLanguageChange(value)}
            >
              <SelectTrigger id="language" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t.english}</SelectItem>
                <SelectItem value="hi">{t.hindi}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="theme">{t.theme}</Label>
            <RadioGroup
              id="theme"
              value={theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}
              className="mt-2 flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">{t.light}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">{t.dark}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">{t.system}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="mb-8 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">{t.dangerZone}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t.resetAppData}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.resetAppDataDescription}
                </p>
              </div>
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t.reset}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.resetConfirmation}</DialogTitle>
                    <DialogDescription>
                      {t.resetConfirmationDescription}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsResetDialogOpen(false)}
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleResetAppData}
                    >
                      {t.reset}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
