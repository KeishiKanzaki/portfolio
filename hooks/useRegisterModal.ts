import {create} from 'zustand';

type ModelProps = {
    isOpen: boolean;
    onOpen: () => void
    onClose: () => void;
};

export const useRegisterModal = create<ModelProps>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));