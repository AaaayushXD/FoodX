import EmptyLogo from "@/assets/empty.png";

interface EmptryProp {
  parent?: string;
  children?: string;
  action?: () => void;
  style?: React.CSSProperties;
  actionText?: string;
  loading?: boolean;
}

export const Empty: React.FC<EmptryProp> = ({
  action,
  children,
  parent,
  style,
  actionText,
  loading,
}) => {
  return (
    <div className="flex w-full h-full  flex-col items-center justify-center">
      <img
        style={style}
        src={parent || EmptyLogo}
        className="w-[15rem] h-[13.5rem] "
        alt=""
      />
      <p className="text-[var(--dark-secondary-text)] text-lg">{children}</p>
      {action && (
        <button
          disabled={loading}
          className=" px-6 mt-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          onClick={() => action()} // Define a refresh function for interactivity
        >
          {actionText || "Refresh"}
        </button>
      )}
    </div>
  );
};
