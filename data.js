import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// رابط ومفتاح مشروع NOVA Store الصحيح
const SUPABASE_URL = 'https://lhuxgbgokhusvknrrmj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXhnYmdva2h1c3Zrbm5ydm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMzEyOTAsImV4cCI6MjEwNzkwNzI5MH0.Pv5DeFzR7tzsI42Jnt-Gboq-aqMvjapSYQ6o3r-U3jU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. المنتجات
export async function fetchProductsRealtime(callback) {
  const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
  callback(data || []);
  supabase.channel('products-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
    const { data: newData } = await supabase.from('products').select('*').order('id', { ascending: false });
    callback(newData || []);
  }).subscribe();
}
export async function addProductDB(product) { return await supabase.from('products').insert([product]); }
export async function updateProductDB(id, product) { return await supabase.from('products').update(product).eq('id', id); }
export async function deleteProductDB(id) { return await supabase.from('products').delete().eq('id', id); }

// 2. الطلبات
export async function saveOrderDB(order) { return await supabase.from('orders').insert([order]); }
export async function fetchOrdersRealtime(callback) {
  const { data } = await supabase.from('orders').select('*').order('date', { ascending: false });
  callback(data || []);
  supabase.channel('orders-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
    const { data: newData } = await supabase.from('orders').select('*').order('date', { ascending: false });
    callback(newData || []);
  }).subscribe();
}

// 3. العملاء
export async function saveCustomerDB(customer) { return await supabase.from('customers').insert([customer]); }
export async function fetchCustomersRealtime(callback) {
  const { data } = await supabase.from('customers').select('*').order('date', { ascending: false });
  callback(data || []);
  supabase.channel('customers-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, async () => {
    const { data: newData } = await supabase.from('customers').select('*').order('date', { ascending: false });
    callback(newData || []);
  }).subscribe();
}

// 4. الزوار
export async function trackVisit() {
  await supabase.from('visits').insert([{ date: new Date().toISOString().slice(0, 10), time: Date.now(), ua: navigator.userAgent, ref: document.referrer || 'direct' }]);
}
export async function fetchVisitsRealtime(callback) {
  const { data } = await supabase.from('visits').select('*').order('time', { ascending: false });
  callback(data || []);
}

// 5. الإعدادات
export async function fetchSettings(callback) {
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (data) callback(data);
}
export async function saveSettingsDB(settings) { return await supabase.from('settings').upsert({ id: 1, ...settings }); }

// 6. السلة
export function getCart() { return JSON.parse(localStorage.getItem('nova_cart') || '[]'); }
export function saveCart(cart) { localStorage.setItem('nova_cart', JSON.stringify(cart)); }
