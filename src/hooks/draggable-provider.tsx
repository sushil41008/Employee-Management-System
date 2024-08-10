import React from "react";

export const DraggableContext = React.createContext({
    dragging: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleDrag: (_isDragging: boolean) => {},
});
const DraggableProvider = ({ children }: { children: React.ReactNode }) => {
    const [dragging, setDragging] = React.useState(false);

    const handleDrag = (_isDragging: boolean) => setDragging(_isDragging);

    return (
        <DraggableContext.Provider value={{ dragging: dragging, handleDrag: handleDrag }}>
            {children}
        </DraggableContext.Provider>
    );
};

export default DraggableProvider;
