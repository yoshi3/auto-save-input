import { MyWindow } from '@/interfaces';
import AutoSaveInput from '@/AutoSaveInput';

(window as MyWindow & typeof globalThis).AutoSaveInput = AutoSaveInput;