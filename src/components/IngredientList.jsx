export function IngredientList({ ingredients }) {
  return (
    <div className="divide-y divide-stone border-y border-stone">
      {ingredients.map((i) => (
        <details key={i.name} className="ing py-5">
          <summary className="flex items-center justify-between"><span className="display text-[1.75rem]">{i.name}</span><span aria-hidden>+</span></summary>
          <div className="ing-body"><div><p className="pt-3 text-mute">{i.role}</p></div></div>
        </details>
      ))}
    </div>
  );
}
