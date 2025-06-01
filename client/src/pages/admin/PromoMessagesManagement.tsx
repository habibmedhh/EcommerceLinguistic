import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Gift,
  Truck,
  Trophy,
  Star,
  Zap,
  Heart
} from "lucide-react";

interface PromoMessage {
  id: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
  icon: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
}

export default function PromoMessagesManagement() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [messages, setMessages] = useState<PromoMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<PromoMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const iconOptions = [
    { value: "truck", label: "Truck", icon: Truck },
    { value: "gift", label: "Gift", icon: Gift },
    { value: "trophy", label: "Trophy", icon: Trophy },
    { value: "star", label: "Star", icon: Star },
    { value: "zap", label: "Zap", icon: Zap },
    { value: "heart", label: "Heart", icon: Heart }
  ];

  const colorOptions = [
    { value: "bg-gradient-to-r from-green-500 to-emerald-600", label: "Green" },
    { value: "bg-gradient-to-r from-purple-500 to-pink-600", label: "Purple-Pink" },
    { value: "bg-gradient-to-r from-orange-500 to-red-600", label: "Orange-Red" },
    { value: "bg-gradient-to-r from-blue-500 to-cyan-600", label: "Blue-Cyan" },
    { value: "bg-gradient-to-r from-yellow-500 to-amber-600", label: "Yellow-Amber" },
    { value: "bg-gradient-to-r from-indigo-500 to-purple-600", label: "Indigo-Purple" }
  ];

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        const promoSettings = settings.find((s: any) => s.key === 'promo_messages');
        
        if (promoSettings && promoSettings.value) {
          setMessages(JSON.parse(promoSettings.value));
        } else {
          // Initialize with default messages
          const defaultMessages: PromoMessage[] = [
            {
              id: "free-shipping",
              messageEn: "🚚 Free shipping everywhere!",
              messageFr: "🚚 Livraison gratuite partout !",
              messageAr: "🚚 شحن مجاني في كل مكان !",
              icon: "truck",
              bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
              textColor: "text-white",
              isActive: true
            },
            {
              id: "lottery",
              messageEn: "🎁 Buy and participate in the lottery!",
              messageFr: "🎁 Achetez et participez à la tombola !",
              messageAr: "🎁 اشتري وشارك في السحب !",
              icon: "gift",
              bgColor: "bg-gradient-to-r from-purple-500 to-pink-600",
              textColor: "text-white",
              isActive: true
            },
            {
              id: "prize",
              messageEn: "🏆 This month's lottery: iPhone 15 Pro!",
              messageFr: "🏆 Tombola de ce mois : iPhone 15 Pro !",
              messageAr: "🏆 سحب هذا الشهر : آيفون 15 برو !",
              icon: "trophy",
              bgColor: "bg-gradient-to-r from-orange-500 to-red-600",
              textColor: "text-white",
              isActive: true
            }
          ];
          setMessages(defaultMessages);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages promotionnels",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessages = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'promo_messages',
          value: JSON.stringify(messages),
          description: 'Promotional banner messages configuration'
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Messages promotionnels sauvegardés",
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les messages",
        variant: "destructive",
      });
    }
  };

  const handleAddMessage = () => {
    const newMessage: PromoMessage = {
      id: `message-${Date.now()}`,
      messageEn: "",
      messageFr: "",
      messageAr: "",
      icon: "gift",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
      textColor: "text-white",
      isActive: true
    };
    setEditingMessage(newMessage);
    setIsDialogOpen(true);
  };

  const handleEditMessage = (message: PromoMessage) => {
    setEditingMessage({ ...message });
    setIsDialogOpen(true);
  };

  const handleSaveMessage = () => {
    if (!editingMessage) return;

    const existingIndex = messages.findIndex(m => m.id === editingMessage.id);
    if (existingIndex >= 0) {
      const updatedMessages = [...messages];
      updatedMessages[existingIndex] = editingMessage;
      setMessages(updatedMessages);
    } else {
      setMessages([...messages, editingMessage]);
    }

    setIsDialogOpen(false);
    setEditingMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const toggleMessageActive = (id: string) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Gift;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/settings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux paramètres
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Messages Promotionnels</h1>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={saveMessages} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button onClick={handleAddMessage}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau message
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {messages.map((message) => {
            const IconComponent = getIconComponent(message.icon);
            
            return (
              <Card key={message.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${message.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${message.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Message ID: {message.id}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Switch
                            checked={message.isActive}
                            onCheckedChange={() => toggleMessageActive(message.id)}
                          />
                          <span className="text-sm text-gray-600">
                            {message.isActive ? "Actif" : "Inactif"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMessage(message)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Anglais</Label>
                      <p className="text-sm text-gray-600 mt-1">{message.messageEn}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Français</Label>
                      <p className="text-sm text-gray-600 mt-1">{message.messageFr}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">العربية</Label>
                      <p className="text-sm text-gray-600 mt-1" dir="rtl">{message.messageAr}</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Aperçu</Label>
                    <div className={`p-3 rounded-lg ${message.bgColor}`}>
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${message.textColor}`} />
                        <span className={`font-semibold ${message.textColor}`}>
                          {message.messageFr}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMessage?.id.startsWith('message-') ? 'Nouveau message' : 'Modifier le message'}
            </DialogTitle>
          </DialogHeader>
          
          {editingMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="messageEn">Message en anglais</Label>
                  <Textarea
                    id="messageEn"
                    value={editingMessage.messageEn}
                    onChange={(e) => setEditingMessage(prev => prev ? { ...prev, messageEn: e.target.value } : null)}
                    placeholder="Enter English message..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="messageFr">Message en français</Label>
                  <Textarea
                    id="messageFr"
                    value={editingMessage.messageFr}
                    onChange={(e) => setEditingMessage(prev => prev ? { ...prev, messageFr: e.target.value } : null)}
                    placeholder="Entrez le message en français..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="messageAr">Message en arabe</Label>
                  <Textarea
                    id="messageAr"
                    value={editingMessage.messageAr}
                    onChange={(e) => setEditingMessage(prev => prev ? { ...prev, messageAr: e.target.value } : null)}
                    placeholder="أدخل الرسالة بالعربية..."
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icône</Label>
                  <Select
                    value={editingMessage.icon}
                    onValueChange={(value) => setEditingMessage(prev => prev ? { ...prev, icon: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="bgColor">Couleur de fond</Label>
                  <Select
                    value={editingMessage.bgColor}
                    onValueChange={(value) => setEditingMessage(prev => prev ? { ...prev, bgColor: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${option.value}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingMessage.isActive}
                  onCheckedChange={(checked) => setEditingMessage(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label>Message actif</Label>
              </div>

              {/* Preview */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Aperçu</Label>
                <div className={`p-3 rounded-lg ${editingMessage.bgColor}`}>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getIconComponent(editingMessage.icon);
                      return <IconComponent className={`h-5 w-5 ${editingMessage.textColor}`} />;
                    })()}
                    <span className={`font-semibold ${editingMessage.textColor}`}>
                      {editingMessage.messageFr || "Votre message apparaîtra ici..."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveMessage}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}