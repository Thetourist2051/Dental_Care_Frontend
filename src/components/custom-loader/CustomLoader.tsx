import style from './CustomLoader.module.scss'

const CustomLoader = () => {
  return (
    <div className={style["loader-container"]}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle className={style["circle"] + ' ' + style["outer"]} cx="50" cy="50" r="45" />
        <circle className={style["circle"] + ' ' + style["inner"]} cx="50" cy="50" r="25" />
        <circle className={style["dots"]} cx="50" cy="5" r="3" />
        <circle className={style["dots"]} cx="95" cy="50" r="3" />
        <circle className={style["dots"]} cx="50" cy="95" r="3" />
        <circle className={style["dots"]} cx="5" cy="50" r="3" />
      </svg>
    </div>
  );
};

export default CustomLoader;
