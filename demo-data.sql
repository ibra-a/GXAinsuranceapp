-- GXA Insurance Demo Data
-- Realistic claims for Djibouti with variety of statuses, dates, and scenarios

-- Clear existing data (optional)
-- DELETE FROM claims WHERE claim_number LIKE 'CLM-%';

-- Insert 15 realistic claims for demo
INSERT INTO claims (
  claim_number,
  user_name,
  policy_number,
  contact_email,
  contact_phone,
  accident_datetime,
  vehicle_plate,
  vehicle_make,
  vehicle_model,
  accident_description,
  photo_urls,
  status,
  admin_notes
) VALUES
  -- Recent pending claims
  (
    'CLM-20251029103045',
    'Ahmed Mohamed Hassan',
    'GXA-DJ-2024-1547',
    'ahmed.hassan@example.dj',
    '+253 77 12 34 56',
    NOW() - INTERVAL '3 hours',
    'DJI-8765',
    'Toyota',
    'Land Cruiser',
    'Collision au rond-point près de Bawadi Mall. L''autre véhicule n''a pas respecté la priorité. Dommages à l''avant droit du véhicule.',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800'],
    'pending',
    NULL
  ),
  (
    'CLM-20251029085512',
    'Fatima Ibrahim Ali',
    'GXA-DJ-2023-0892',
    'fatima.ali@example.dj',
    '+253 77 88 99 00',
    NOW() - INTERVAL '5 hours',
    'DJI-3421',
    'Nissan',
    'Patrol',
    'Accident sur la route de Loyada. Collision avec un véhicule qui changeait de voie sans clignotant. Impact côté gauche.',
    ARRAY['https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800', 'https://images.unsplash.com/photo-1587837073080-448bc6a2329b?w=800'],
    'pending',
    NULL
  ),
  (
    'CLM-20251029072345',
    'Youssef Abdallah Omar',
    'GXA-DJ-2024-2103',
    'youssef.omar@example.dj',
    '+253 77 45 67 89',
    NOW() - INTERVAL '8 hours',
    'DJI-5678',
    'Honda',
    'Civic',
    'Stationnement - véhicule rayé dans le parking de l''Hôtel Kempinski. Dommages sur la portière arrière droite.',
    ARRAY['https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800'],
    'pending',
    NULL
  ),
  (
    'CLM-20251028204530',
    'Khadija Mohamed Said',
    'GXA-DJ-2024-0456',
    'khadija.said@example.dj',
    '+253 77 23 45 67',
    NOW() - INTERVAL '20 hours',
    'DJI-9012',
    'Mitsubishi',
    'L200',
    'Accident sur Avenue 13. Collision arrière à un feu rouge. Le véhicule derrière n''a pas freiné à temps.',
    ARRAY['https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1609705883996-7318f8eaaa59?w=800'],
    'pending',
    NULL
  ),
  (
    'CLM-20251028143022',
    'Hassan Ismail Aden',
    'GXA-DJ-2023-1789',
    'hassan.aden@example.dj',
    '+253 77 34 56 78',
    NOW() - INTERVAL '1 day' - INTERVAL '3 hours',
    'DJI-2345',
    'Toyota',
    'Hilux',
    'Accrochage sur Rue d''Ethiopie près du marché central. Autre véhicule a reculé sans regarder. Dommages mineurs au pare-chocs avant.',
    ARRAY['https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    'pending',
    NULL
  ),

  -- Recently approved claims
  (
    'CLM-20251028112045',
    'Amina Abdi Mohamed',
    'GXA-DJ-2024-0678',
    'amina.mohamed@example.dj',
    '+253 77 56 78 90',
    NOW() - INTERVAL '1 day' - INTERVAL '8 hours',
    'DJI-4567',
    'Hyundai',
    'Tucson',
    'Collision latérale sur Boulevard de la République. L''autre conducteur a grillé un stop. Photos claires des dommages côté droit.',
    ARRAY['https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    'approved',
    'Réclamation approuvée. Photos conformes, rapport de police vérifié. Montant estimé: 185,000 DJF. Veuillez contacter notre garage partenaire Auto Service Djibouti.'
  ),
  (
    'CLM-20251027185512',
    'Mohamed Ali Farah',
    'GXA-DJ-2023-2345',
    'mohamed.farah@example.dj',
    '+253 77 67 89 01',
    NOW() - INTERVAL '2 days' - INTERVAL '5 hours',
    'DJI-6789',
    'Ford',
    'Ranger',
    'Accident sur la route nationale vers Arta. Collision avec un animal sur la chaussée. Dommages importants au capot et pare-brise.',
    ARRAY['https://images.unsplash.com/photo-1609705883996-7318f8eaaa59?w=800', 'https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800', 'https://images.unsplash.com/photo-1587837073080-448bc6a2329b?w=800'],
    'approved',
    'Dossier complet et validé. Dommages évalués à 240,000 DJF. Autorisation accordée pour réparation. Franchise de 25,000 DJF appliquée.'
  ),
  (
    'CLM-20251027093022',
    'Houssein Youssef Ali',
    'GXA-DJ-2024-1234',
    'houssein.ali@example.dj',
    '+253 77 78 90 12',
    NOW() - INTERVAL '2 days' - INTERVAL '12 hours',
    'DJI-7890',
    'Isuzu',
    'D-Max',
    'Dommages causés par grêle pendant tempête. Plusieurs impacts sur le toit et capot du véhicule. Événement météo confirmé.',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1609705883996-7318f8eaaa59?w=800'],
    'approved',
    'Réclamation météo validée. Événement confirmé par services météorologiques. Montant: 95,000 DJF. Pas de franchise pour dommages naturels.'
  ),

  -- Some rejected claims
  (
    'CLM-20251026141512',
    'Ibrahim Hassan Mohamed',
    'GXA-DJ-2022-5678',
    'ibrahim.hassan@example.dj',
    '+253 77 89 01 23',
    NOW() - INTERVAL '3 days' - INTERVAL '6 hours',
    'DJI-8901',
    'Mazda',
    'BT-50',
    'Accident sur parking privé. Dommages à la portière avant gauche. Circonstances peu claires.',
    ARRAY['https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800'],
    'rejected',
    'Réclamation rejetée. Les photos montrent des dommages antérieurs non déclarés. Métadonnées des photos ne correspondent pas à la date d''accident déclarée. Police non couverte pour ce type d''incident.'
  ),
  (
    'CLM-20251025103045',
    'Nour Abdi Hassan',
    'GXA-DJ-2023-3456',
    'nour.hassan@example.dj',
    '+253 77 90 12 34',
    NOW() - INTERVAL '4 days' - INTERVAL '8 hours',
    'DJI-9012',
    'Chevrolet',
    'Colorado',
    'Collision arrière sur Avenue Foch. Autres dommages visibles non liés à l''incident.',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1587837073080-448bc6a2329b?w=800'],
    'rejected',
    'Après vérification, plusieurs incohérences détectées: 1) Date d''accident hors délai de 24h, 2) Dommages multiples non expliqués, 3) Absence de rapport de police. Réclamation non recevable.'
  ),

  -- Older approved claims for statistics
  (
    'CLM-20251024152233',
    'Aicha Mohamed Elmi',
    'GXA-DJ-2024-4567',
    'aicha.elmi@example.dj',
    '+253 77 01 23 45',
    NOW() - INTERVAL '5 days',
    'DJI-0123',
    'Toyota',
    'RAV4',
    'Collision avec véhicule de livraison sur Rue de Marseille. Témoin présent, rapport de police complet.',
    ARRAY['https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800', 'https://images.unsplash.com/photo-1609705883996-7318f8eaaa59?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    'approved',
    'Dossier exemplaire. Documentation complète, photos de qualité, rapport de police détaillé. Montant: 320,000 DJF. Réparations autorisées chez Toyota Djibouti.'
  ),
  (
    'CLM-20251023094512',
    'Zakaria Ahmed Ali',
    'GXA-DJ-2023-5678',
    'zakaria.ali@example.dj',
    '+253 77 12 34 56',
    NOW() - INTERVAL '6 days',
    'DJI-1234',
    'Nissan',
    'Navara',
    'Bris de glace - impact de projectile sur autoroute. Aucun autre dommage au véhicule.',
    ARRAY['https://images.unsplash.com/photo-1609705883996-7318f8eaaa59?w=800'],
    'approved',
    'Bris de glace confirmé. Remplacement autorisé chez Crystal Glass Djibouti. Montant: 45,000 DJF sans franchise.'
  ),
  (
    'CLM-20251022173045',
    'Maryam Ismail Said',
    'GXA-DJ-2024-6789',
    'maryam.said@example.dj',
    '+253 77 23 45 67',
    NOW() - INTERVAL '7 days',
    'DJI-2345',
    'Kia',
    'Sportage',
    'Accident de stationnement au Centre Commercial. Portière endommagée par chariot. Vidéosurveillance disponible.',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800'],
    'approved',
    'Validé avec preuve vidéo. Dommages mineurs. Montant: 75,000 DJF. Franchise standard de 15,000 DJF appliquée.'
  ),

  -- One more pending for good measure
  (
    'CLM-20251029000012',
    'Abdallah Houssein Omar',
    'GXA-DJ-2024-7890',
    'abdallah.omar@example.dj',
    '+253 77 34 56 78',
    NOW() - INTERVAL '15 hours',
    'DJI-3456',
    'Volkswagen',
    'Amarok',
    'Collision sur rond-point Héron. Véhicule tiers a perdu le contrôle. Dommages côté conducteur.',
    ARRAY['https://images.unsplash.com/photo-1613214149929-af7b0d4f0c32?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1587837073080-448bc6a2329b?w=800', 'https://images.unsplash.com/photo-1609705883996-7318f8eaaa59?w=800'],
    'pending',
    NULL
  ),

  -- Another rejected for balance
  (
    'CLM-20251021115522',
    'Saleh Mohamed Ibrahim',
    'GXA-DJ-2022-8901',
    'saleh.ibrahim@example.dj',
    '+253 77 45 67 89',
    NOW() - INTERVAL '8 days',
    'DJI-4567',
    'Peugeot',
    'Pick-up',
    'Prétend accident sur Route de Tadjourah mais incohérences majeures dans le récit.',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    'rejected',
    'Réclamation frauduleuse suspectée. Photos ne correspondent pas au lieu déclaré. Métadonnées GPS montrent emplacement différent. Analyse d''expert révèle dommages antérieurs. Dossier transféré au service juridique.'
  )
ON CONFLICT (claim_number) DO NOTHING;

-- Verify the inserts
SELECT 
  status,
  COUNT(*) as count
FROM claims
GROUP BY status
ORDER BY status;

-- Show recent claims
SELECT 
  claim_number,
  user_name,
  vehicle_make || ' ' || vehicle_model as vehicle,
  status,
  accident_datetime,
  created_at
FROM claims
ORDER BY created_at DESC
LIMIT 10;

