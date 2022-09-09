import { IconProps } from './EditIcon';

const DeleteIcon = (props: IconProps) => {
  const { size = 16, color = '#000', onClick } = props;
  return (
    <svg
      onClick={onClick}
      viewBox="0 0 1024 1024"
      p-id="2601"
      width={size}
      height={size}
    >
      <path
        d="M928 224l-160 0L768 160c0-52.928-42.72-96-95.264-96L352 64C299.072 64 256 107.072 256 160l0 64L96 224C78.304 224 64 238.304 64 256s14.304 32 32 32l832 0c17.696 0 32-14.304 32-32S945.696 224 928 224z"
        p-id="2602"
        fill={color}
      />
      <path
        d="M800 352 224 352c-0.032 0 0.096 0 0.064 0-8.48 0-16.64 3.136-22.656 9.088C195.392 367.104 192 375.008 192 383.52L192 864c0 52.928 43.136 96 96.064 96l448.064 0C789.056 960 832 916.928 832 864L832 384C832 366.368 817.664 352.064 800 352zM448 800c0 17.696-14.304 32-32 32s-32-14.304-32-32L384 448c0-17.696 14.304-32 32-32s32 14.304 32 32L448 800zM640 800c0 17.696-14.304 32-32 32s-32-14.304-32-32L576 448c0-17.696 14.304-32 32-32s32 14.304 32 32L640 800z"
        p-id="2603"
        fill={color}
      />
    </svg>
  );
};

export default DeleteIcon;