import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { PrivateMediaFolder, MediaItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface PrivateFoldersTabProps {
  folders: PrivateMediaFolder[];
  onFolderUpdate?: (folders: PrivateMediaFolder[]) => void;
}

export const PrivateFoldersTab = ({ folders: initialFolders, onFolderUpdate }: PrivateFoldersTabProps) => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<PrivateMediaFolder[]>(initialFolders || []);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<PrivateMediaFolder | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [newFolder, setNewFolder] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleCreateFolder = () => {
    if (!newFolder.name || !newFolder.password) {
      toast({
        title: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    if (newFolder.password !== newFolder.confirmPassword) {
      toast({
        title: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    const folder: PrivateMediaFolder = {
      id: Date.now(),
      name: newFolder.name,
      password: newFolder.password,
      coverImage: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df',
      itemCount: 0,
      items: [],
      isUnlocked: false,
    };

    const updatedFolders = [...folders, folder];
    setFolders(updatedFolders);
    onFolderUpdate?.(updatedFolders);

    toast({
      title: 'Папка создана',
      description: `Приватная папка "${newFolder.name}" успешно создана`,
    });

    setNewFolder({ name: '', password: '', confirmPassword: '' });
    setShowCreateDialog(false);
  };

  const handleUnlockFolder = () => {
    if (!selectedFolder) return;

    if (passwordInput === selectedFolder.password) {
      const updatedFolders = folders.map(f =>
        f.id === selectedFolder.id ? { ...f, isUnlocked: true } : f
      );
      setFolders(updatedFolders);
      onFolderUpdate?.(updatedFolders);

      toast({
        title: 'Папка разблокирована',
      });

      setShowUnlockDialog(false);
      setPasswordInput('');
      setSelectedFolder(null);
    } else {
      toast({
        title: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const handleLockFolder = (folder: PrivateMediaFolder) => {
    const updatedFolders = folders.map(f =>
      f.id === folder.id ? { ...f, isUnlocked: false } : f
    );
    setFolders(updatedFolders);
    onFolderUpdate?.(updatedFolders);

    toast({
      title: 'Папка заблокирована',
    });
  };

  const handleAddMedia = (folderId: number, files: FileList) => {
    const newItems: MediaItem[] = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      type: file.type.startsWith('image/') ? 'photo' : file.type.startsWith('video/') ? 'video' : 'audio',
      thumbnail: URL.createObjectURL(file),
      url: URL.createObjectURL(file),
      locked: false,
    }));

    const updatedFolders = folders.map(f =>
      f.id === folderId
        ? { ...f, items: [...f.items, ...newItems], itemCount: f.items.length + newItems.length }
        : f
    );

    setFolders(updatedFolders);
    onFolderUpdate?.(updatedFolders);

    toast({
      title: 'Файлы добавлены',
      description: `Добавлено файлов: ${newItems.length}`,
    });
  };

  const handleDeleteFolder = (folderId: number) => {
    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    onFolderUpdate?.(updatedFolders);

    toast({
      title: 'Папка удалена',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Приватные папки</h3>
          <p className="text-muted-foreground mt-1">
            Защищенные паролем папки для ваших личных фото и видео
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="FolderPlus" size={16} className="mr-2" />
              Создать папку
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать приватную папку</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folderName">Название папки</Label>
                <Input
                  id="folderName"
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  placeholder="Например: Личные фото"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={newFolder.password}
                  onChange={(e) => setNewFolder({ ...newFolder, password: e.target.value })}
                  placeholder="Введите пароль"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newFolder.confirmPassword}
                  onChange={(e) => setNewFolder({ ...newFolder, confirmPassword: e.target.value })}
                  placeholder="Повторите пароль"
                />
              </div>

              <Button onClick={handleCreateFolder} className="w-full">
                Создать папку
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {folders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="FolderLock" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Нет приватных папок</h3>
            <p className="text-muted-foreground mb-4">
              Создайте защищенную паролем папку для хранения личных фото и видео
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Icon name="FolderPlus" size={16} className="mr-2" />
              Создать первую папку
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map(folder => (
            <Card key={folder.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={folder.coverImage}
                  alt={folder.name}
                  className={`w-full h-full object-cover ${!folder.isUnlocked ? 'blur-lg' : ''}`}
                />
                {!folder.isUnlocked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Icon name="Lock" size={48} className="text-white" />
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{folder.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {folder.itemCount} файлов
                  </span>
                </div>

                <div className="flex gap-2">
                  {folder.isUnlocked ? (
                    <>
                      <label className="flex-1">
                        <Button variant="outline" className="w-full" asChild>
                          <span>
                            <Icon name="Upload" size={16} className="mr-2" />
                            Добавить
                          </span>
                        </Button>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => e.target.files && handleAddMedia(folder.id, e.target.files)}
                          className="hidden"
                        />
                      </label>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLockFolder(folder)}
                      >
                        <Icon name="Lock" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedFolder(folder);
                        setShowUnlockDialog(true);
                      }}
                    >
                      <Icon name="Unlock" size={16} className="mr-2" />
                      Разблокировать
                    </Button>
                  )}
                </div>

                {folder.isUnlocked && folder.items.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {folder.items.slice(0, 6).map(item => (
                      <div key={item.id} className="aspect-square relative group">
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-full h-full object-cover rounded"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Icon name="Play" size={24} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Разблокировать папку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unlockPassword">Введите пароль для "{selectedFolder?.name}"</Label>
              <Input
                id="unlockPassword"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Пароль"
                onKeyPress={(e) => e.key === 'Enter' && handleUnlockFolder()}
              />
            </div>
            <Button onClick={handleUnlockFolder} className="w-full">
              <Icon name="Unlock" size={16} className="mr-2" />
              Разблокировать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
