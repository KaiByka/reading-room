/** Pretvara naslov u siguran slug za ime datoteke. */
export function slugify(text) {
  const map = {
    č: 'c', ć: 'c', ž: 'z', š: 's', đ: 'dj',
    Č: 'c', Ć: 'c', Ž: 'z', Š: 's', Đ: 'dj',
    ä: 'a', ö: 'o', ü: 'u', é: 'e', è: 'e', á: 'a', à: 'a',
  };
  return (
    (text || 'bez-naslova')
      .toLowerCase()
      .replace(/[čćžšđČĆŽŠĐäöüéèáà]/g, (c) => map[c] ?? c)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'bez-naslova'
  );
}
