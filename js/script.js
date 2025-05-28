const objToSelect = (kode, tag, header) => {
  $(`#${tag}`).html(`<option value="">${header}</option>`); // Clear existing options

  fetch(`https://i01107.github.io/nik-generator/wilayah/${kode}.json`)
  .then(response => response.json())
  .then(regions => {
    if (regions.length > 0) {
      regions.sort((a, b) => a.nama.localeCompare(b.nama)); // Sort regions by name
      regions.forEach(region => {
        $(`#${tag}`).append(`<option value="${region.kode}">${region.nama}</option>`);
      });
    } else {
      $(`#${tag}`).append('<option value="">Tidak ada data</option>');
    }
  })
}

const generageNIK = () => {
  const nama = $('#nama').val();
  const tgl = $('#tgl').val().padStart(2, '0');
  const bln = $('#bln').val().padStart(2, '0');
  const thn = $('#thn').val().slice(-2);
  const provinsi = $('#provinsi').val().slice(-2);
  const kabko = $('#kabko').val().slice(-2);
  const kecamatan = $('#kecamatan').val().slice(-2);

  let namaLow = nama.toLowerCase();
  // let namaArr = namaLow.split(' ');

  let total = namaLow.charCodeAt(0);
  for (let i = 0; i < namaLow.length; i++) {
    total += namaLow.charCodeAt(i);
  }

  // Generate NIK
  const nik = `${provinsi}${kabko}${kecamatan}${tgl}${bln}${thn}${total.toString().padStart(4, '0')}`;
  
  // Display NIK
  $('#nik').text('');
  $('#nik').text(nik);
}

const ctc = (str) => {
  navigator.clipboard.writeText(str);
  $("#notif").show();
  $("#notif").fadeOut(1000);
}

$(document).ready(function() {
  objToSelect('0', 'provinsi', 'Pilih provinsi');

  $('#provinsi').change(function() {
    objToSelect($(this).val(), 'kabko', 'Pilih kabupaten');
  });

  $('#kabko').change(function() {
    objToSelect($(this).val(), 'kecamatan', 'Pilih kecamatan');
  });

  $('#theForm').validate({
    rules: {
      nama: {
        required: true
      },
      tgl: {
        required: true
      },
      bln: {
        required: true
      },
      thn: {
        required: true
      },
      provinsi: {
        required: true
      },
      kabko: {
        required: true
      },
      kecamatan: {
        required: true
      }
    },
    messages: {
      nama: {
        required: "Nama harus diisi"
      },
      tgl: {
        required: "Tanggal lahir harus diisi"
      },
      bln: {
        required: "Bulan lahir harus diisi"
      },
      thn: {
        required: "Nama harus diisi"
      },
      provinsi: {
        required: "Provinsi harus dipilih"
      },
      kabko: {
        required: "Kabupaten/Kota harus dipilih"
      },
      kecamatan: {
        required: "Kecamatan harus dipilih"
      }
    },
    errorElement: 'span',
    errorPlacement: function (error, element) {
      error.addClass('invalid-feedback');
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass('is-invalid');
    },
    submitHandler: function() {
      generageNIK();
    }
  });

  $('#copy').click(function() {
    ctc($('#nik').text());
  });
});