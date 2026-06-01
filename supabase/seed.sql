insert into books (title, author, genre, isbn, cover_url, is_available)
values
  (
    'O Horizonte de Papel',
    'Lia Montenegro',
    'Ficção',
    '9780000000011',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Mapas do Amanhã',
    'Caio Nunes',
    'Tecnologia',
    '9780000000028',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Sombras na Estante',
    'Helena Duarte',
    'Terror',
    '9780000000035',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    false
  ),
  (
    'Atlas da Memória',
    'Rafael Sampaio',
    'História',
    '9780000000042',
    'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Entre Páginas e Estrelas',
    'Marina Costa',
    'Romance',
    '9780000000059',
    'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Pequenos Grandes Cientistas',
    'Nina Freire',
    'Infantil',
    '9780000000066',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Vozes da Biografia',
    'Igor Salgado',
    'Biografia',
    '9780000000073',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Mundos Encantados',
    'Lua Farias',
    'Fantasia',
    '9780000000080',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Ciência em Movimento',
    'Paulo Rezende',
    'Ciências',
    '9780000000097',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'Caminhos da Não-Ficção',
    'Sara Vilela',
    'Não-Ficção',
    '9780000000103',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    true
  )
on conflict (isbn) do nothing;
